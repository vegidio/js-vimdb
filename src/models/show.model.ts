import Reference from './reference.model'

export default class Show
{
    identifier: string
    url: string
    type: string
    name: string
    alternativeName: string
    summary: string
    description: string
    duration: number
    aggregateRating: { ratingValue: number, ratingCount: number }
    genre: string[]
    poster: { small: string, big: string }
    recommended: Reference[]
    contentRating: string
    year: number

    credits: {
        directors: Reference[],
        cast: Reference[]
    }

    static fromObject(obj: unknown): Show
    {
        const show = new Show()
        return Object.assign(show, obj)
    }
}