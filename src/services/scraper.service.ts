import * as fs from 'fs'
import * as path from 'path'
import fetch, { Headers} from 'node-fetch'
import * as cheerio from 'cheerio'
import { AllHtmlEntities } from 'html-entities'

import Movie from '../models/movie.model'
import Series from '../models/series.model'
import { EpisodeReference, Reference } from '../types'
import { SearchType } from '../enums'

/**
 * @ignore
 */
export default class ScraperService
{
    private readonly language: string
    private readonly isDebugMode: boolean
    private readonly headers: Headers
    private readonly entities: AllHtmlEntities

    constructor(language: string, debug: boolean)
    {
        this.language = language
        this.isDebugMode = debug
        this.headers = new Headers({ 'Accept-Language': language })
        this.entities = new AllHtmlEntities()
    }

    async fetchShowInfo(identifier: string): Promise<Movie | Series>
    {
        // Setup the variables needed for fetch
        const [$, show] = await this.setupFetch(identifier, `https://www.imdb.com/title/${identifier}`)

        show.identifier = identifier
        show.url = `https://www.imdb.com/title/${identifier}`
        show.summary = $('div.summary_text').text().trim()
        show.description = $('div#titleStoryLine').find('span:not([class])').html().trim()
        show.year = Number($('a[title="See more release dates"]').text().match(/[0-9]{4}/)[0])
        show.name = this.scrapName($)
        show.alternativeName = this.scrapAlternativeName($)
        show.contentRating = this.scrapContentRating($)
        show.duration = this.scrapDuration($)
        show.aggregateRating = this.scrapRating($)
        show.genre = this.scrapGenre($)
        show.image = this.scrapImages($)
        show.recommended = this.scrapRecommended($)

        return show
    }

    async fetchShowCredits(identifier: string): Promise<Movie | Series>
    {
        // Setup the variables needed for fetch
        const [$, show] = await this.setupFetch(identifier, `https://www.imdb.com/title/${identifier}/fullcredits`)

        show.credits = {
            directors: this.scrapDirectors($),
            cast: this.scrapCast($)
        }

        return show
    }

    async fetchSeriesEpisodes(identifier: string): Promise<Movie | Series>
    {
        // Setup the variables needed for fetch
        const [$, show] = await this.setupFetch(identifier, `https://www.imdb.com/title/${identifier}/episodes`)

        if (show instanceof Series) {
            const seasons = Number($('#bySeason > option[selected]').val())
            const promises: Promise<EpisodeReference[]>[] = []
            for (let i = 1; i <= seasons; i++) { promises.push(this.scrapSeason(identifier, i)) }

            show.seasons = seasons
            show.episodes = (await Promise.all(promises)).flat()
        }

        return show
    }

    async search(query: string, type: SearchType): Promise<Reference[]>
    {
        const url = `https://www.imdb.com/find?q=${encodeURIComponent(query)}&s=${type}`
        const html = await fetch(url, { headers: this.headers }).then(response => response.text())
        const $ = cheerio.load(html)

        const result: Reference[] = []
        $('tr.findResult').each((_, el) => {
            result.push({
                identifier: $(el).find('td.primary_photo > a').attr('href')
                    .match(/title\/(.+)\//)[1],
                name: $(el).find('td.result_text > a').text()
            })
        })

        return result
    }

    // region - Private methods
    private async setupFetch(identifier: string, url: string): Promise<[CheerioStatic, Movie | Series]>
    {
        const html = await fetch(url, { headers: this.headers })
            .then(response => response.text())

        // Saves a copy of the HTML for debug purposes
        if(this.isDebugMode) this.saveHtml(identifier, url, html)
        const $ = cheerio.load(html)

        // Determine the show type
        const type = $('meta[property="og:type"]').attr('content')
        const show = (type && type.split('.')[1] === 'tv_show') ? new Series() : new Movie()

        return [$, show]
    }

    private saveHtml(identifier: string, url: string, html: string)
    {
        const scrapDir = 'scraps'
        if(!fs.existsSync(scrapDir)) fs.mkdirSync(scrapDir)

        const basename = path.basename(url)
        const filename = identifier === basename ? identifier : `${identifier}_${basename}`
        fs.writeFileSync(`${scrapDir}/${filename}_${this.language}.html`, html)
    }
    // endregion

    // region - Show Info
    private scrapName($: CheerioStatic): string
    {
        const el = $('div.title_wrapper > h1').html()
        const name = (el.includes('<span')) ? el.match(/(.+)<span/)[1] : el.trim()
        return this.entities.decode(name).trim()
    }

    private scrapAlternativeName($: CheerioStatic): string
    {
        const el = $('div.originalTitle').html()
        return el ? this.entities.decode(el.match(/(.+)<span/)[1]) : undefined
    }

    private scrapContentRating($: CheerioStatic): string
    {
        const group = $('div.subtext').html().trim().match(/(.*)\n/)
        return group ? group[1] : undefined
    }

    private scrapDuration($: CheerioStatic): number
    {
        const duration = $('div.subtext > time').attr('datetime').match(/PT([0-9]+)M/)[1]
        return Number(duration)
    }

    private scrapRating($: CheerioStatic): { ratingValue: number, ratingCount: number }
    {
        return {
            ratingValue: Number($('span[itemprop="ratingValue"]').text()
                .replace(',', '.')),
            ratingCount: Number($('span[itemprop="ratingCount"]').text()
                .replace(/[,.]/, ''))
        }
    }

    private scrapGenre($: CheerioStatic): string[]
    {
        const genre: string[] = []
        $('#titleStoryLine > div.inline > h4')
            .filter((_, el) => $(el).text() === 'Genres:')
            .nextAll('a')
            .each((_, el) => {
                genre.push($(el).text().trim())
            })

        return genre
    }

    private scrapImages($: CheerioStatic): { small: string, big: string }
    {
        const small = $('div.poster > a > img').attr('src')
        const big = small.replace('_V1_UX182_CR0,0,182,268_AL_.jpg',
            '_V1_SY1000_CR0,0,666,1000_AL_.jpg')

        return { small: small, big: big }
    }

    private scrapRecommended($: CheerioStatic): Reference[]
    {
        const shows: Reference[] = []
        $('div.rec_item').each((_, el) => {
            let name = $(el).find('img').attr('title')
            if (!name) name = $(el).find('div[class="gen_pane"]').text().trim()

            shows.push({
                identifier: $(el).attr('data-tconst'),
                name: name
            })
        })

        return shows
    }
    // endregion

    // region - Show Credits
    private scrapDirectors($: CheerioStatic): Reference[]
    {
        const directors: Reference[] = []
        $('#fullcredits_content > h4')
            .filter((_, el) => $(el).text().includes('Directed'))
            .next('table')
            .find('td.name > a')
            .each((_, el) => {
                directors.push({
                    identifier: $(el).attr('href').match(/\/name\/(.+)\//)[1],
                    name: $(el).text().trim()
                })
            })

        return directors
    }

    private scrapCast($: CheerioStatic): Reference[]
    {
        const cast: Reference[] = []
        $('table[class="cast_list"]')
            .find('td:not([class]) > a')
            .each((_, el) => {
                cast.push({
                    identifier: $(el).attr('href').match(/\/name\/(.+)\//)[1],
                    name: $(el).text().trim()
                })
            })

        return cast
    }
    // endregion

    // region - Series Episodes
    private async scrapSeason(identifier: string, season: number): Promise<EpisodeReference[]>
    {
        const url = `https://www.imdb.com/title/${identifier}/episodes?season=${season}`
        const html = await fetch(url, { headers: this.headers }).then(response => response.text())
        const $ = cheerio.load(html)

        const references: EpisodeReference[] = []
        $('div.list_item').each((_, el) => {
            references.push({
                season: season,
                number: Number($(el).find('meta').attr('content')),
                identifier: $(el).find('div.wtw-option-standalone').attr('data-tconst'),
                name: $(el).find('a[itemprop="name"]').text(),
                summary: $(el).find('div[itemprop="description"]').text().trim(),
                aggregateRating: {
                    ratingValue: Number($(el).find('span.ipl-rating-star__rating').html()
                        .replace(',', '.')),
                    ratingCount: Number($(el).find('span.ipl-rating-star__total-votes').text()
                        .match(/[0-9]+/))
                }
            })
        })

        return references
    }
    // endregion
}