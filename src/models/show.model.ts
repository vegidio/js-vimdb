import Reference from './reference.model'

/**
 * Represents a Show, with information about a Movie or Series.
 */
export default class Show
{
    /** Unique identifier for movies and series */
    identifier: string

    /** Identifies the show type, "movie" or "tv_show" */
    type: string

    /** Name of the show */
    name: string

    /** An alternative name of the show, if it exists */
    alternativeName: string

    /** Summary of the show */
    summary: string

    /** Description of the show */
    description: string

    /** The duration of the show, in minutes */
    duration: number

    aggregateRating: {
        /** The mean value of all votes given to the show */
        ratingValue: number,

        /** The number of votes given to the show */
        ratingCount: number
    }

    /** Some genres that can be used to classify this show */
    genre: string[]

    poster: {
        /** URL to a low resolution version of the show's poster */
        small: string,

        /** URL to a high resolution version of the show's poster */
        big: string
    }

    /** Array of references to other shows that are similar to this one */
    recommended: Reference[]

    /** The content rating of the show */
    contentRating: string

    /** The year when the show was released */
    year: number

    /** URL to the show on IMDb */
    url: string

    credits: {
        /** Array of references to all directors of the show */
        directors: Reference[],

        /** Array of references to the cast of the show */
        cast: Reference[]
    }

    /**
     * Creates an instance of {@link Show} from a raw JS object.
     *
     * @param {unknown} obj - JS object from where the Show instance will be created
     * @return {@link Show} - object presenting a movie or series.
     */
    static fromObject(obj: unknown): Show
    {
        const show = new Show()
        return Object.assign(show, obj)
    }
}