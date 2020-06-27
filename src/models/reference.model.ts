/**
 * Represents a reference to other Show or Person.
 */
export default class Reference
{
    /** Unique identifier for movies, series or people */
    identifier: string

    /** Name of the show or person */
    name: string

    /**
     * Initialize a reference to other IMDb class.
     *
     * @constructor
     * @param {string} [identifier] - the unique identifier for the show or person.
     * @param {string} [name] - the name of the reference.
     */
    constructor(identifier?: string, name?: string)
    {
        this.identifier = identifier
        this.name = name
    }
}