import ImdbService from './services/imdb.service'
import Show from './models/show.model'

export { Show }

export async function getShowById(identifier: string, debug = false): Promise<Show> {
    const imdb = new ImdbService(debug)
    return await imdb.fetchShowInfo(identifier)
}

export const vimdb = {
    // Models
    Show,

    // Functions
    getShowById
}