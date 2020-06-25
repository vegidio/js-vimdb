import fetch from 'node-fetch'
import * as FileType from 'file-type'
import * as vimdb from '../'
import { Show, Reference } from '../'

let show: Show

beforeAll(async () => {
    jest.setTimeout(60000)
    show = await vimdb.getAllShowDataById('tt0096697', true)
})

describe('The Simpsons is correctly scraped', () =>
{
    test('Type is "tv_show"', () => {
        expect(show.type).toEqual('tv_show')
    })

    test('Name contains "Simpsons"', () => {
        expect(show.name).toEqual(expect.stringContaining('Simpsons'))
    })

    test('Summary is not empty', () => {
        expect(show.summary.length).not.toEqual(0)
    })

    test('Description is not empty', () => {
        expect(show.description.length).not.toEqual(0)
    })

    test('Duration is 22 minutes', () => {
        expect(show.duration).toEqual(22)
    })

    test('Rating value and count are numbers', () => {
        expect(show.aggregateRating.ratingValue).not.toBeNaN()
        expect(show.aggregateRating.ratingCount).not.toBeNaN()
    })

    test('There are 12 recommendations and one is "Family Guy"', () => {
        expect(show.recommended.length).toEqual(12)
        expect(show.recommended).toContainEqual(new Reference('tt0182576', 'Family Guy'))
    })

    test('Genres are "Animation" and "Comedy"', () => {
        expect(show.genre).toEqual(['Animation', 'Comedy'])
    })

    test('The content rating is a number', () => {
        expect(show.contentRating).not.toBeNaN()
    })

    test('The release year is 1989', () => {
        expect(show.year).toEqual(1989)
    })
})

describe('The posters are scraped', () =>
{
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
})

describe('The credits are correctly scraped', () =>
{
    test('There are at least the directors Mike and Mark', () => {
        expect(show.credits.directors).toContainEqual(new Reference('nm0027214', 'Mike B. Anderson'))
        expect(show.credits.directors).toContainEqual(new Reference('nm0456658', 'Mark Kirkland'))
    })

    test('There are at least the actors Hank and Nacy', () => {
        expect(show.credits.cast).toContainEqual(new Reference('nm0144657', 'Dan Castellaneta'))
        expect(show.credits.cast).toContainEqual(new Reference('nm0004813', 'Nancy Cartwright'))
    })
})