import fetch from 'node-fetch'
import * as FileType from 'file-type'
import Imdb, { Show, Reference } from '../'

let show: Show

beforeAll(async () => {
    jest.setTimeout(60000)
    const imdb = new Imdb('pt-br', true)
    show = await imdb.getAllShowDataById('tt0096697')
})

describe('The Simpsons is correctly scraped (PT-BR)', () =>
{
    test('Type is "tv_show"', () => {
        expect(show.type).toEqual('tv_show')
    })

    test('Name is "Os Simpsons"', () => {
        expect(show.name).toEqual('Os Simpsons')
    })

    test('Alternative name is "The Simpsons"', () => {
        expect(show.alternativeName).toEqual('The Simpsons')
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

    test('There are 12 recommendations and one is "Uma Família da Pesada"', () => {
        expect(show.recommended.length).toEqual(12)
        expect(show.recommended).toContainEqual(new Reference('tt0182576', 'Uma Família da Pesada'))
    })

    test('Genres are "Animation" and "Comedy"', () => {
        expect(show.genre).toEqual(['Animation', 'Comedy'])
    })

    test('The content rating is 12', () => {
        expect(show.contentRating).toEqual('12')
    })

    test('The release year is 1989', () => {
        expect(show.year).toEqual(1989)
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

    test('There are at least the directors Mike and Mark', () => {
        expect(show.credits.directors).toContainEqual(new Reference('nm0027214', 'Mike B. Anderson'))
        expect(show.credits.directors).toContainEqual(new Reference('nm0456658', 'Mark Kirkland'))
    })

    test('There are at least the actors Hank and Nancy', () => {
        expect(show.credits.cast).toContainEqual(new Reference('nm0144657', 'Dan Castellaneta'))
        expect(show.credits.cast).toContainEqual(new Reference('nm0004813', 'Nancy Cartwright'))
    })
})