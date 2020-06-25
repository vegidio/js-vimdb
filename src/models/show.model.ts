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
    recommended: { identifier: string, name: string }[]
    contentRating: number
    year: number

    credits: {
        directors: { identifier: string, name: string }[],
        cast: { identifier: string, name: string }[]
    }

    static fromObject(obj: unknown): Show
    {
        const show = new Show()
        return Object.assign(show, obj)
    }
}