import ImdbService from './services/imdb.service'
import Show from './models/show.model'

export { Show }

export async function getShowById(identifier: string, debug = false): Promise<Show> {
    const imdb = new ImdbService(debug)
    return imdb.fetchShowInfo(identifier)
}

export async function getShowCreditsById(identifier: string, debug = false): Promise<Show> {
    const imdb = new ImdbService(debug)
    return imdb.fetchShowCredits(identifier)
}

export async function getAllShowDataById(identifier: string, debug = false): Promise<Show> {
    const imdb = new ImdbService(debug)

    return Promise.all([
        imdb.fetchShowInfo(identifier),
        imdb.fetchShowCredits(identifier)
    ]).then(shows => Show.fromObject({
        ...shows[0], ...shows[1]
    }))
}

export const vimdb = {
    // Models
    Show,

    // Functions
    getShowById,
    getShowCreditsById,
    getAllShowDataById
}