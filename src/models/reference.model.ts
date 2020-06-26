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

    /**
     * Creates an instance of {@link Reference} from a raw JS object.
     *
     * @param {unknown} obj - JS object from where the Reference instance will be created
     * @return {@link Show} - object presenting a reference to a show or person.
     */
    static fromObject(obj: unknown): Reference
    {
        const reference = new Reference()
        return Object.assign(reference, obj)
    }
}