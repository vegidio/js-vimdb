import fetch from 'node-fetch'
import * as FileType from 'file-type'
import Imdb, { Series, Reference } from '../'

let series: Series

beforeAll(async () => {
    jest.setTimeout(60000)
    const imdb = new Imdb('en', true)
    series = await imdb.getAllShowDataById('tt2650940')
})

describe('The Business is correctly scraped (EN)', () =>
{
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series)
    })

    test('Name is "The Business"', () => {
        expect(series.name).toEqual('The Business')
    })

    test('Alternative name is "O Negócio"', () => {
        expect(series.alternativeName).toEqual('O Negócio')
    })

    test('Summary is not empty', () => {
        expect(series.summary.length).not.toEqual(0)
    })

    test('Description is not empty', () => {
        expect(series.description.length).not.toEqual(0)
    })

    test('Duration is 51 minutes', () => {
        expect(series.duration).toEqual(51)
    })

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).not.toBeNaN()
        expect(series.aggregateRating.ratingCount).not.toBeNaN()
    })

    test('There are 12 recommendations and one is "Call Me Bruna"', () => {
        expect(series.recommended.length).toEqual(12)
        expect(series.recommended).toContainEqual(new Reference('tt5210146', 'Call Me Bruna'))
    })

    test('Genres are "Comedy" and "Drama"', () => {
        expect(series.genre).toEqual(['Comedy', 'Drama'])
    })

    test('The content rating is TV-MA', () => {
        expect(series.contentRating).toEqual('TV-MA')
    })

    test('The release year is 2013', () => {
        expect(series.year).toEqual(2013)
    })

    test('Small poster is an image', () => {
        return fetch(series.image.small)
            .then(response => response.buffer())
            .then(buffer => FileType.fromBuffer(buffer))
            .then(fileType => {
                expect(fileType.mime).toEqual('image/jpeg')
            })
    })

    test('Big poster is an image', () => {
        return fetch(series.image.big)
            .then(response => response.buffer())
            .then(buffer => FileType.fromBuffer(buffer))
            .then(fileType => {
                expect(fileType.mime).toEqual('image/jpeg')
            })
    })

    test('There are at least the directors Michel and Júlia', () => {
        expect(series.credits.directors).toContainEqual(new Reference('nm2633637', 'Michel Tikhomiroff'))
        expect(series.credits.directors).toContainEqual(new Reference('nm1155504', 'Júlia Pacheco Jordão'))
    })

    test('There are at least the actors Rafaela and Juliana', () => {
        expect(series.credits.cast).toContainEqual(new Reference('nm0973465', 'Rafaela Mandelli'))
        expect(series.credits.cast).toContainEqual(new Reference('nm3170472', 'Juliana Schalch'))
    })
})