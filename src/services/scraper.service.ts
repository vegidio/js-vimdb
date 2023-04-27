// noinspection JSMethodCanBeStatic

import * as fs from 'fs';
import * as path from 'path';
import fetch, { Headers } from 'node-fetch';
import * as cheerio from 'cheerio';
import { decode } from 'html-entities';
import { DateTime } from 'luxon';

import Movie from '../models/movie.model';
import Series from '../models/series.model';
import Person from '../models/person.model';
import { EpisodeReference, Reference } from '../types';
import { SearchType } from '../enums';

import '../extensions/string';

/**
 * @ignore
 */
export default class ScraperService {
    private readonly language: string;
    private readonly isDebugMode: boolean;
    private readonly headers: Headers;

    constructor(language: string, debug: boolean) {
        this.language = language;
        this.isDebugMode = debug;
        this.headers = new Headers({ 'Accept-Language': language, 'User-Agent': this.randomUserAgent() });
    }

    async fetchShowInfo(identifier: string): Promise<Movie | Series> {
        // Setup the variables needed for fetch
        const [$main, show, $tech] = await Promise.all([
            this.setupFetchShow(identifier, `https://www.imdb.com/title/${identifier}`),
            this.setupFetchTechnical(identifier, `https://www.imdb.com/title/${identifier}/technical`),
        ]).then((res) => res.flat() as [cheerio.Root, Movie | Series, cheerio.Root]);

        if (!show) throw Error("Failed to get the show's info.");
        const json = JSON.parse($main('script[type="application/ld+json"]').html());

        show.identifier = identifier;
        show.url = `https://www.imdb.com/title/${identifier}`;
        show.name = this.scrapShowName($main);
        show.alternativeName = this.scrapAlternativeName($main);
        show.summary = this.scrapSummary(json);
        show.description = this.scrapDescription($main);
        show.contentRating = this.scrapContentRating(json);
        show.year = this.scrapYear(json);
        show.duration = this.scrapDuration($tech);
        show.aggregateRating = this.scrapRating(json);
        show.genre = this.scrapGenre(json);
        show.image = this.scrapShowImages($main);
        show.recommended = this.scrapRecommended($main);

        return show;
    }

    async fetchShowCredits(identifier: string): Promise<Movie | Series> {
        // Setup the variables needed for fetch
        const [$, show] = await this.setupFetchShow(identifier, `https://www.imdb.com/title/${identifier}/fullcredits`);
        if (!show) throw Error("Failed to get the show's credits.");

        show.credits = {
            directors: this.scrapDirectors($),
            writers: this.scrapWriters($),
            cast: this.scrapCast($),
        };

        return show;
    }

    async fetchSeriesEpisodes(identifier: string): Promise<Movie | Series> {
        // Setup the variables needed for fetch
        const [$, show] = await this.setupFetchShow(identifier, `https://www.imdb.com/title/${identifier}/episodes`);
        if (!show) throw Error("Failed to get the series' episodes.");

        if (show instanceof Series) {
            const seasons = $('#bySeason').find('option:not([value="-1"])').length;
            const promises: Promise<EpisodeReference[]>[] = [];
            for (let i = 1; i <= seasons; i++) {
                promises.push(this.scrapSeason(identifier, i));
            }

            show.seasons = seasons;
            show.episodes = (await Promise.all(promises)).flat();
        }

        return show;
    }

    async fetchPerson(identifier: string): Promise<Person> {
        // Setup the variables needed for fetch
        const [$, person] = await this.setupFetchPerson(identifier, `https://www.imdb.com/name/${identifier}`);
        if (!person) throw Error("Failed to get the person's info.");

        person.identifier = identifier;
        person.url = `https://www.imdb.com/name/${identifier}`;
        person.name = this.scrapPersonName($);
        person.jobs = this.scrapJobs($);
        person.birthday = this.scrapBirthday($);
        person.image = this.scrapPersonImages($);
        person.filmography = {
            knownFor: this.scrapFilmographyKnownFor($),
            actor: this.scrapFilmographyActor($),
            director: this.scrapFilmographyDirector($),
        };

        return person;
    }

    async search(query: string, type: SearchType): Promise<Reference[]> {
        const url = `https://www.imdb.com/find?q=${encodeURIComponent(query)}&s=${type}`;
        const html = await fetch(url, { headers: this.headers }).then((response) => response.text());
        const $ = cheerio.load(html);

        const result: Reference[] = [];
        $('tr.findResult').each((_, el) => {
            let identifier: string;
            if (type === SearchType.Title) {
                identifier = $(el)
                    .find('td.primary_photo > a')
                    .attr('href')
                    .match(/title\/(.+)\//)[1];
            } else {
                identifier = $(el)
                    .find('td.primary_photo > a')
                    .attr('href')
                    .match(/name\/(.+)\//)[1];
            }

            result.push({
                identifier: identifier,
                name: $(el).find('td.result_text > a').text(),
            });
        });

        return result;
    }

    // region - Private methods
    private randomUserAgent(): string {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        ];

        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    private async setupFetchShow(identifier: string, url: string): Promise<[cheerio.Root, Movie | Series]> {
        const $ = await this.setupFetch(identifier, url);
        if (!$) return [undefined, undefined];

        // Determine the show type
        const type = $('meta[property="og:type"]').attr('content');
        const show = type && type.split('.')[1] === 'tv_show' ? new Series() : new Movie();

        return [$, show];
    }

    private async setupFetchTechnical(identifier: string, url: string): Promise<cheerio.Root> {
        return await this.setupFetch(identifier, url);
    }

    private async setupFetchPerson(identifier: string, url: string): Promise<[cheerio.Root, Person]> {
        const $ = await this.setupFetch(identifier, url);
        if (!$) return [undefined, undefined];

        return [$, new Person()];
    }

    private async setupFetch(identifier: string, url: string): Promise<cheerio.Root> {
        const html = await fetch(url, { headers: this.headers }).then((response) =>
            response.status == 200 ? response.text() : undefined,
        );

        if (!html) return undefined;

        // Saves a copy of the HTML for debug purposes
        if (this.isDebugMode) this.saveHtml(identifier, url, html);

        return cheerio.load(html);
    }

    private saveHtml(identifier: string, url: string, html: string) {
        const scrapDir = 'scraps';
        if (!fs.existsSync(scrapDir)) fs.mkdirSync(scrapDir);

        const basename = path.basename(url);
        const filename = identifier === basename ? identifier : `${identifier}_${basename}`;
        fs.writeFileSync(`${scrapDir}/${filename}_${this.language}.html`, html);
    }
    // endregion

    // region - Show Info
    private scrapShowName($: cheerio.Root): string {
        const value = $('h1[data-testid="hero__pageTitle"]').text();
        return decode(value).trim();
    }

    private scrapAlternativeName($: cheerio.Root): string {
        let value = $('div[class^="OriginalTitle"]').text();
        if (value.includes(': ')) value = value.rightOf(': ');
        return value ? decode(value).trim() : undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrapSummary(json: any): string {
        return <string>json.description;
    }

    private scrapDescription($: cheerio.Root): string {
        return $('p[data-testid="plot"] span').first().text();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrapContentRating(json: any): string {
        return <string>json.contentRating;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrapYear(json: any): number {
        const dateStr = <string>json.datePublished;
        const date = DateTime.fromISO(dateStr);
        return date.year;
    }

    private scrapDuration($: cheerio.Root): number {
        let duration = 0;

        $('#technical_content > table > tbody > tr > td.label')
            .filter((_, el) => $(el).text().includes('Runtime'))
            .next('td')
            .each((_, el) => {
                duration = Number(
                    $(el)
                        .text()
                        .match(/([0-9]+)(?!.*[0-9]+)/gm)[0],
                );
            });

        return duration;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrapRating(json: any): { ratingValue: number; ratingCount: number } {
        return {
            ratingValue: <number>json?.aggregateRating?.ratingValue,
            ratingCount: <number>json?.aggregateRating?.ratingCount,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrapGenre(json: any): string[] {
        return <string[]>json.genre;
    }

    private scrapShowImages($: cheerio.Root): { small: string; big: string } {
        const small = $('div[data-testid="hero-media__poster"] > div > img').attr('src');
        const big = small ? small.replace(/_V1_(.+)\.jpg/, '_V1_.jpg') : undefined;

        return { small: small, big: big };
    }

    private scrapRecommended($: cheerio.Root): Reference[] {
        const shows: Reference[] = [];
        $('div.ipc-sub-grid > div.ipc-poster-card').each((_, el) => {
            const identifier = $(el)
                .find('div > a')
                .attr('href')
                .match(/\/title\/(.+)\//)[1];
            const name = $(el).find('div > a > span').text();

            shows.push({ identifier, name });
        });

        return shows;
    }
    // endregion

    // region - Show Credits
    private scrapDirectors($: cheerio.Root): Reference[] {
        const directors: Reference[] = [];
        $('#fullcredits_content > h4')
            .filter((_, el) => $(el).text().includes('Directed'))
            .next('table')
            .find('td.name > a')
            .each((_, el) => {
                directors.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/\/name\/(.+)\//)[1],
                    name: $(el).text().trim(),
                });
            });

        return directors;
    }

    private scrapWriters($: cheerio.Root): Reference[] {
        const directors: Reference[] = [];
        $('#fullcredits_content > h4')
            .filter((_, el) => $(el).text().includes('Writing'))
            .next('table')
            .find('td.name > a')
            .each((_, el) => {
                directors.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/\/name\/(.+)\//)[1],
                    name: $(el).text().trim(),
                });
            });

        return directors;
    }

    private scrapCast($: cheerio.Root): Reference[] {
        const cast: Reference[] = [];
        $('table[class="cast_list"]')
            .find('td:not([class]) > a')
            .each((_, el) => {
                cast.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/\/name\/(.+)\//)[1],
                    name: $(el).text().trim(),
                });
            });

        return cast;
    }
    // endregion

    // region - Series Episodes
    private async scrapSeason(identifier: string, season: number): Promise<EpisodeReference[]> {
        const url = `https://www.imdb.com/title/${identifier}/episodes?season=${season}`;
        const html = await fetch(url, { headers: this.headers }).then((response) => response.text());
        const $ = cheerio.load(html);

        const references: EpisodeReference[] = [];
        $('div.list_item').each((_, el) => {
            references.push({
                season: season,
                number: Number($(el).find('meta').attr('content')),
                identifier: $(el).find('div.wtw-option-standalone').attr('data-tconst'),
                name: $(el).find('a[itemprop="name"]').text(),
                summary: this.scrapEpisodeSummary($(el)),
                aggregateRating: {
                    ratingValue: Number($(el).find('span.ipl-rating-star__rating').html()),
                    ratingCount: Number(
                        $(el)
                            .find('span.ipl-rating-star__total-votes')
                            .text()
                            .match(/[0-9]+/),
                    ),
                },
            });
        });

        return references;
    }

    private scrapEpisodeSummary(el: cheerio.Cheerio): string {
        const value = el.find('div[itemprop="description"]').html();
        return value.includes('<a href') ? undefined : decode(value).trim();
    }
    // endregion

    // region - Person
    private scrapPersonName($: cheerio.Root): string {
        const el = $('#name-overview-widget-layout').find('span');
        return decode(el.html()).trim();
    }

    private scrapJobs($: cheerio.Root): string[] {
        const jobs: string[] = [];
        $('#name-job-categories > a > span').each((_, el) => {
            jobs.push($(el).html().trim());
        });

        return jobs;
    }

    private scrapBirthday($: cheerio.Root): Date {
        const dateStr = $('#name-born-info > time')
            .attr('datetime')
            .split('-')
            .map((value: string) => Number(value));
        return new Date(Date.UTC(dateStr[0], dateStr[1], dateStr[2]));
    }

    private scrapFilmographyKnownFor($: cheerio.Root): Reference[] {
        const shows: Reference[] = [];
        $('div.knownfor-title-role > a').each((_, el) => {
            shows.push({
                identifier: $(el)
                    .attr('href')
                    .match(/title\/(.+)\//)[1],
                name: decode($(el).html()).trim(),
            });
        });

        return shows;
    }

    private scrapFilmographyActor($: cheerio.Root): Reference[] {
        const shows: Reference[] = [];

        $('#filmo-head-actor')
            .next('div.filmo-category-section')
            .find('div > b > a')
            .each((_, el) => {
                shows.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/title\/(.+)\//)[1],
                    name: decode($(el).html()).trim(),
                });
            });

        if (shows.length > 0) return shows;

        $('#filmo-head-actress')
            .next('div.filmo-category-section')
            .find('div > b > a')
            .each((_, el) => {
                shows.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/title\/(.+)\//)[1],
                    name: decode($(el).html()).trim(),
                });
            });

        return shows;
    }

    private scrapFilmographyDirector($: cheerio.Root): Reference[] {
        const shows: Reference[] = [];
        $('#filmo-head-director')
            .next('div.filmo-category-section')
            .find('div > b > a')
            .each((_, el) => {
                shows.push({
                    identifier: $(el)
                        .attr('href')
                        .match(/title\/(.+)\//)[1],
                    name: decode($(el).html()).trim(),
                });
            });

        return shows;
    }

    private scrapPersonImages($: cheerio.Root): { small: string; big: string } {
        const small = $('#name-poster').attr('src');
        const big = small ? small.replace(/_V1_(.+)\.jpg/, '_V1_.jpg') : undefined;

        return { small: small, big: big };
    }
    // endregion
}
