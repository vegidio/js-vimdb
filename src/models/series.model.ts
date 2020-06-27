import Show from './show.model'
import Reference from './reference.model'

/**
 * Represents a Series.
 * @category Model
 */
export default class Series extends Show
{
    /** An alternative name of the series, if it exists */
    alternativeName: string

    /** Summary of the series */
    summary: string

    /** Description of the series */
    description: string

    /** Array of references to other series or movies that are similar to this one */
    recommended: Reference[]

    /** The year when the series was released */
    year: number

    /**
     * Creates an instance of {@link Series} from a raw JS object.
     *
     * @param {unknown} obj - JS object from where the Series instance will be created.
     * @return {@link Series} - object presenting a series.
     */
    static fromObject(obj: unknown): Series
    {
        const series = new Series()
        return Object.assign(series, obj)
    }
}