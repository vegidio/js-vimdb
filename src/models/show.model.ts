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

    // TODO: Scrap this
    contentRating: number
    year: number
}