import fetch from 'node-fetch'
import * as FileType from 'file-type'
import Imdb, { Series, Reference } from '../'

let series: Series

beforeAll(async () => {
    jest.setTimeout(60000)
    const imdb = new Imdb('en', true)
    series = await imdb.getAllShowDataById('tt0096697')
})

describe('The Simpsons is correctly scraped (EN)', () =>
{
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series)
    })

    test('Name is "The Simpsons"', () => {
        expect(series.name).toEqual('The Simpsons')
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

    test('There are 12 recommendations and one is "Family Guy"', () => {
        expect(series.recommended.length).toEqual(12)
        expect(series.recommended).toContainEqual(new Reference('tt0182576', 'Family Guy'))
    })

    test('Genres are "Animation" and "Comedy"', () => {
        expect(series.genre).toEqual(['Animation', 'Comedy'])
    })

    test('The content rating is TV-PG', () => {
        expect(series.contentRating).toEqual('TV-PG')
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