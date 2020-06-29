import ScraperService from '../services/scraper.service'
import Movie from '../models/movie.model'
import Series from '../models/series.model'
import { Reference } from '../types'
import { SearchType } from '../enums'

/**
 * Represents an IMDb instance from where the data will be scraped.
 * @category Controller
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
     * imdb.getShow('tt0096697')
     *     .then(console.log)
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Movie} or {@link Series} - object presenting a movie or series.
     */
    async getShow(identifier: string): Promise<Movie | Series>
    {
        return this.scraper.fetchShowInfo(identifier)
    }

    /**
     * Scrap the credits of a show, like the list of directors and cast.
     *
     * ```typescript
     * // Get the credits (directors and actors) of the show "Better Call Saul"
     * imdb.getShowCredits('tt3032476')
     *     .then(show => console.log(show.credits))
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Movie} or {@link Series} - object presenting a movie or series.
     */
    async getShowCredits(identifier: string): Promise<Movie | Series>
    {
        return this.scraper.fetchShowCredits(identifier)
    }

    /**
     * Scrap the episodes references of a series.
     *
     * ```typescript
     * // Get the references to the episodes of the series "The Mandalorian"
     * imdb.getSeriesEpisodes('tt8111088')
     *     .then(show => console.log(show.episodes))
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Series} - object presenting a movie or series.
     */
    async getSeriesEpisodes(identifier: string): Promise<Movie | Series>
    {
        return this.scraper.fetchSeriesEpisodes(identifier)
    }

    /**
     * Scrap the main information, credits and episodes (if it's a series) of a show.
     *
     * ```typescript
     * // Get the all information (details, credits and episodes) of the show "Cobra Kai"
     * imdb.getAllShowData('tt7221388')
     *     .then(console.log);
     * ```
     *
     * @async
     * @param {string} identifier - the unique identifier for movies or series.
     * @return {@link Movie} or {@link Series} - object presenting a movie or series.
     */
    async getAllShowData(identifier: string): Promise<Movie | Series>
    {
        return Promise.all([
            this.scraper.fetchShowInfo(identifier),
            this.scraper.fetchShowCredits(identifier),
            this.scraper.fetchSeriesEpisodes(identifier)
        ]).then(shows => {
            if (shows[0] instanceof Series) {
                return Series.fromObject({ ...shows[0], ...shows[1], ...shows[2] })
            } else {
                return Movie.fromObject({ ...shows[0], ...shows[1] })
            }
        })
    }

    /**
     * Search for shows or people.
     *
     * ```typescript
     * // Search for shows with the query "Hangover"
     * imdb.search('Hangover', SearchType.Title)
     *     .then(console.log);
     * ```
     *
     * @async
     * @param {string} query - the query parameter.
     * @param {SearchType} [type=SearchType.Title] - the type of data that must be searched.
     * @return {@link Reference} - array of references to a shows or people.
     */
    async search(query: string, type = SearchType.Title): Promise<Reference[]>
    {
        return this.scraper.search(query, type)
    }
}