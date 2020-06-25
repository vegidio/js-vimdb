import ScraperService from './services/scraper.service'
import Show from './models/show.model'

export default class Imdb
{
    private scraper: ScraperService

    constructor(language = 'en', debug = false)
    {
        this.scraper = new ScraperService(language, debug)
    }

    async getShowById(identifier: string): Promise<Show>
    {
        return this.scraper.fetchShowInfo(identifier)
    }

    async getShowCreditsById(identifier: string): Promise<Show>
    {
        return this.scraper.fetchShowCredits(identifier)
    }

    async getAllShowDataById(identifier: string): Promise<Show>
    {
        return Promise.all([
            this.scraper.fetchShowInfo(identifier),
            this.scraper.fetchShowCredits(identifier)
        ]).then(shows => Show.fromObject({
            ...shows[0], ...shows[1]
        }))
    }
}