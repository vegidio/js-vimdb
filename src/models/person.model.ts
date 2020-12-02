import { Reference } from '../types';

/**
 * Represents a Person.
 * @category Model
 */
export default class Person {
    /** Unique identifier for the person */
    identifier: string;

    /** The name of the person */
    name: string;

    /** Job categories that this person took */
    jobs: string[];

    /** Birthday of the person */
    birthday: Date;

    filmography: {
        /** Array of references to the works that this person is most known for */
        knownFor: Reference[];

        /** Array of references to the works as actor */
        actor: Reference[];

        /** Array of references to the works as director */
        director: Reference[];
    };

    image: {
        /** URL to a low resolution version of the person's image */
        small: string;

        /** URL to a high resolution version of the person's image */
        big: string;
    };

    /** URL to the person on IMDb */
    url: string;
}
