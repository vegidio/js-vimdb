import fetch from 'node-fetch'
import * as FileType from 'file-type'
import Imdb, { Series, Reference } from '../'

let series: Series

beforeAll(async () => {
    jest.setTimeout(60000)
    const imdb = new Imdb('pt-br', true)
    series = await imdb.getAllShowDataById('tt0096697')
})

describe('The Simpsons is correctly scraped (PT-BR)', () =>
{
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series)
    })

    test('Name is "Os Simpsons"', () => {
        expect(series.name).toEqual('Os Simpsons')
    })

    test('Alternative name is "The Simpsons"', () => {
        expect(series.alternativeName).toEqual('The Simpsons')
    })

    test('Summary is not empty', () => {
        expect(series.summary.length).not.toEqual(0)
    })

    test('Description is not empty', () => {
        expect(series.description.length).not.toEqual(0)
    })

    test('Duration is 22 minutes', () => {
        expect(series.duration).toEqual(22)
    })

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).not.toBeNaN()
        expect(series.aggregateRating.ratingCount).not.toBeNaN()
    })

    test('There are 12 recommendations and one is "Uma Família da Pesada"', () => {
        expect(series.recommended.length).toEqual(12)
        expect(series.recommended).toContainEqual(new Reference('tt0182576', 'Uma Família da Pesada'))
    })

    test('Genres are "Animation" and "Comedy"', () => {
        expect(series.genre).toEqual(['Animation', 'Comedy'])
    })

    test('The content rating is 12', () => {
        expect(series.contentRating).toEqual('12')
    })

    test('The release year is 1989', () => {
        expect(series.year).toEqual(1989)
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

    test('There are at least the directors Mike and Mark', () => {
        expect(series.credits.directors).toContainEqual(new Reference('nm0027214', 'Mike B. Anderson'))
        expect(series.credits.directors).toContainEqual(new Reference('nm0456658', 'Mark Kirkland'))
    })

    test('There are at least the actors Hank and Nancy', () => {
        expect(series.credits.cast).toContainEqual(new Reference('nm0144657', 'Dan Castellaneta'))
        expect(series.credits.cast).toContainEqual(new Reference('nm0004813', 'Nancy Cartwright'))
    })
})