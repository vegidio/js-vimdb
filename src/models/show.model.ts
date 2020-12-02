import { Reference } from '../types';

/**
 * Represents a Show, with information about a Movie or Series.
 * @ignore
 */
export default abstract class Show {
    /** Unique identifier for the show */
    identifier: string;

    /** Name of the show */
    name: string;

    /** Summary of the show */
    summary: string;

    /** The duration of the show, in minutes */
    duration: number;

    aggregateRating: {
        /** The mean value of all votes given to the show */
        ratingValue: number;

        /** The number of votes given to the show */
        ratingCount: number;
    };

    /** Some genres that can be used to classify this show */
    genre: string[];

    image: {
        /** URL to a low resolution version of the show's image */
        small: string;

        /** URL to a high resolution version of the show's image */
        big: string;
    };

    /** The content rating of the show */
    contentRating: string;

    /** URL to the show on IMDb */
    url: string;

    credits: {
        /** Array of references to all directors of the show */
        directors: Reference[];

        /** Array of references to all writers of the show */
        writers: Reference[];

        /** Array of references to the cast of the show */
        cast: Reference[];
    };
}
