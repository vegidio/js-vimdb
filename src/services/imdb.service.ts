import * as fs from 'fs'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

import Show from '../models/show.model'
import Reference from '../models/reference.model'

export default class ImdbService
{
    private readonly isDebugMode: boolean

    constructor(debug = false)
    {
        this.isDebugMode = debug
    }

    async fetchShowInfo(identifier: string): Promise<Show>
    {
        const html = await fetch(`https://www.imdb.com/title/${identifier}`)
            .then(response => response.text())

        // Saves a copy of the HTML for debug purposes
        if(this.isDebugMode) this.saveHtml(identifier, html)
        const $ = cheerio.load(html)

        const show = new Show()
        show.identifier = identifier
        show.url = `https://www.imdb.com/title/${identifier}`
        show.type = $('meta[property="og:type"]').attr('content').split('.')[1]
        show.name = $('div.title_wrapper').find('h1').text().trim()
        show.summary = $('div.summary_text').text().trim()
        show.description = $('div#titleStoryLine').find('span:not([class])').html().trim()
        show.contentRating = Number($('div.subtext').text().match(/[0-9]{1,2}/))
        show.year = Number($('a[title="See more release dates"]').text().match(/[0-9]{4}/)[0])
        show.alternativeName = this.scrapOriginalTitle($)
        show.duration = this.scrapDuration($)
        show.aggregateRating = this.scrapRating($)
        show.genre = this.scrapGenre($)
        show.poster = this.scrapPosters($)
        show.recommended = this.scrapRecommended($)

        return show
    }

    async fetchShowCredits(identifier: string): Promise<Show>
    {
        const html = await fetch(`https://www.imdb.com/title/${identifier}/fullcredits`)
            .then(response => response.text())

        // Saves a copy of the HTML for debug purposes
        if(this.isDebugMode) this.saveHtml(identifier, html)
        const $ = cheerio.load(html)

        const show = new Show()
        show.credits = {
            directors: this.scrapDirectors($),
            cast: this.scrapCast($)
        }

        return show
    }

    // region - Show Info
    private saveHtml(filename: string, html: string)
    {
        const scrapDir = 'scraps'
        if(!fs.existsSync(scrapDir)) fs.mkdirSync(scrapDir)
        fs.writeFileSync(`${scrapDir}/${filename}.html`, html)
    }

    private scrapOriginalTitle($: CheerioStatic): string
    {
        const el = $('div.originalTitle').html()
        return el ? el.match(/(.+)<span/)[1] : undefined
    }

    private scrapDuration($: CheerioStatic): number
    {
        const duration = $('div.subtext > time').attr('datetime').match(/PT([0-9]+)M/)[1]
        return Number(duration)
    }

    private scrapRating($: CheerioStatic): { ratingValue: number, ratingCount: number }
    {
        return {
            ratingValue: Number($('span[itemprop="ratingValue"]').text()),
            ratingCount: Number($('span[itemprop="ratingCount"]').text()
                .replace(',', ''))
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

    private scrapPosters($: CheerioStatic): { small: string, big: string }
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
            shows.push({
                identifier: $(el).attr('data-tconst'),
                name: $(el).find('img').attr('title')
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
}