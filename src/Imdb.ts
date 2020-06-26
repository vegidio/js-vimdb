import ScraperService from './services/scraper.service'
import Show from './models/show.model'

/**
 * Represents an IMDb instance from where the data will be scraped.
 */
export default class Imdb
{
    private scraper: ScraperService

    /**
     * Initialize the IMDb class with the default parameters to scrap content.
     *
     * ```typescript
     * // Initialize Imdb with default language = English, and debug = false
     * const imdb1 = new Imdb()
     *
     * // Initialize Imdb to fetch content with Brazilian Portuguese
     * const imdb2 = new Imdb('pt-BR')
     * ```
     *
     * @constructor
     * @param {string} [language=en] - the language in witch you will get the results. Keep in mind that not all data is
     * affected by the language choice.
     * @param {boolean} [debug=false] - define if the data should be scraped in debug mode. While in debug mode, all
     * data scraped from the server will be saved locally in the folder `/scraps`.
     */
    constructor(language = 'en', debug = false)
    {
        this.scraper = new ScraperService(language, debug)
    }

    /**
     * Scrap the main information of a show, like name, description, release year, etc.
     *
     * ```typescript
     * // Get information about the show "The Simpsons"
     * imdb.getShowById('tt0096697')
     *     .then(console.log)
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Show} - object presenting a movie or series.
     */
    async getShowById(identifier: string): Promise<Show>
    {
        return this.scraper.fetchShowInfo(identifier)
    }

    /**
     * Scrap the credits of a show, like the list of directors and cast.
     *
     * ```typescript
     * // Get the credits (directors and actors) of the show "Better Call Saul"
     * imdb.getShowCreditsById('tt3032476')
     *     .then(show => console.log(show.credits))
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Show} - object presenting a movie or series.
     */
    async getShowCreditsById(identifier: string): Promise<Show>
    {
        return this.scraper.fetchShowCredits(identifier)
    }

    /**
     * Scrap the main information and the credits of a show.
     *
     * ```typescript
     * // Get the all information (details, credits and episodes) of the show "Cobra Kai"
     * imdb.getAllShowData('tt7221388')
     *     .then(console.log);
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Show} - object presenting a movie or series.
     */
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