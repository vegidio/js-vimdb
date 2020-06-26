import fetch from 'node-fetch'
import * as FileType from 'file-type'
import Imdb, { Show, Reference } from '../'

let show: Show

beforeAll(async () => {
    jest.setTimeout(60000)
    const imdb = new Imdb('en', true)
    show = await imdb.getAllShowDataById('tt2650940')
})

describe('The Business is correctly scraped (EN)', () =>
{
    test('Type is "tv_show"', () => {
        expect(show.type).toEqual('tv_show')
    })

    test('Name is "The Business"', () => {
        expect(show.name).toEqual('The Business')
    })

    test('Alternative name is "O Negócio"', () => {
        expect(show.alternativeName).toEqual('O Negócio')
    })

    test('Summary is not empty', () => {
        expect(show.summary.length).not.toEqual(0)
    })

    test('Description is not empty', () => {
        expect(show.description.length).not.toEqual(0)
    })

    test('Duration is 51 minutes', () => {
        expect(show.duration).toEqual(51)
    })

    test('Rating value and count are numbers', () => {
        expect(show.aggregateRating.ratingValue).not.toBeNaN()
        expect(show.aggregateRating.ratingCount).not.toBeNaN()
    })

    test('There are 12 recommendations and one is "Call Me Bruna"', () => {
        expect(show.recommended.length).toEqual(12)
        expect(show.recommended).toContainEqual(new Reference('tt5210146', 'Call Me Bruna'))
    })

    test('Genres are "Comedy" and "Drama"', () => {
        expect(show.genre).toEqual(['Comedy', 'Drama'])
    })

    test('The content rating is TV-MA', () => {
        expect(show.contentRating).toEqual('TV-MA')
    })

    test('The release year is 2013', () => {
        expect(show.year).toEqual(2013)
    })

    test('Small poster is an image', () => {
        return fetch(show.poster.small)
            .then(response => response.buffer())
            .then(buffer => FileType.fromBuffer(buffer))
            .then(fileType => {
                expect(fileType.mime).toEqual('image/jpeg')
            })
    })

    test('Big poster is an image', () => {
        return fetch(show.poster.big)
            .then(response => response.buffer())
            .then(buffer => FileType.fromBuffer(buffer))
            .then(fileType => {
                expect(fileType.mime).toEqual('image/jpeg')
            })
    })

    test('There are at least the directors Michel and Júlia', () => {
        expect(show.credits.directors).toContainEqual(new Reference('nm2633637', 'Michel Tikhomiroff'))
        expect(show.credits.directors).toContainEqual(new Reference('nm1155504', 'Júlia Pacheco Jordão'))
    })

    test('There are at least the actors Rafaela and Juliana', () => {
        expect(show.credits.cast).toContainEqual(new Reference('nm0973465', 'Rafaela Mandelli'))
        expect(show.credits.cast).toContainEqual(new Reference('nm3170472', 'Juliana Schalch'))
    })
})