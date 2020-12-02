import Show from './show.model';
import { Reference } from '../types';

/**
 * Represents a Movie.
 * @category Model
 */
export default class Movie extends Show {
    /** An alternative name of the movie, if it exists */
    alternativeName: string;

    /** Summary of the movie */
    summary: string;

    /** Description of the movie */
    description: string;

    /** Array of references to other movies or series that are similar to this one */
    recommended: Reference[];

    /** The year when the movie was released */
    year: number;

    /**
     * Creates an instance of {@link Movie} from a raw JS object.
     *
     * @param {unknown} obj - JS object from where the Movie instance will be created.
     * @return {@link Movie} - object presenting a movie.
     */
    static fromObject(obj: unknown): Movie {
        const movie = new Movie();
        return Object.assign(movie, obj);
    }
}
