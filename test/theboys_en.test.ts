import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Series } from '../src';

let series: Series;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    series = (await imdb.getAllShowData('tt1190634', { episodes: false })) as Series;
});

describe('The Boys is correctly scraped (EN)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('Name is "The Boys"', () => {
        expect(series.name).toEqual('The Boys');
    });

    test('Summary is not empty', () => {
        expect(series.summary.length).not.toEqual(0);
    });

    test('Description is not empty', () => {
        expect(series.description.length).not.toEqual(0);
    });

    test('Duration is 60 minutes', () => {
        expect(series.duration).toEqual(60);
    });

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).not.toBeNaN();
        expect(series.aggregateRating.ratingCount).not.toBeNaN();
    });

    test('There are 12 recommendations and one is "The Mandalorian"', () => {
        expect(series.recommended.length).toEqual(12);
        expect(series.recommended).toContainEqual({ identifier: 'tt8111088', name: 'The Mandalorian' });
    });

    test('Genres are "Action", "Comedy", "Crime", "Sci-Fi"', () => {
        expect(series.genre).toEqual(['Action', 'Comedy', 'Crime', 'Sci-Fi']);
    });

    test('The content rating is TV-MA', () => {
        expect(series.contentRating).toEqual('TV-MA');
    });

    test('The release year is 2019', () => {
        expect(series.year).toEqual(2019);
    });

    test('Small and big posters are different', () => {
        expect(series.image.small).not.toEqual(series.image.big);
    });

    test('Small poster is an image', () => {
        return fetch(series.image.small)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('Big poster is an image', () => {
        return fetch(series.image.big)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('There are at least the directors Philip and Daniel', () => {
        expect(series.credits.directors).toContainEqual({ identifier: 'nm0004223', name: 'Philip Sgriccia' });
        expect(series.credits.directors).toContainEqual({ identifier: 'nm0003733', name: 'Daniel Attias' });
    });

    test('There are at least the writers Garth and Eric', () => {
        expect(series.credits.writers).toContainEqual({ identifier: 'nm1212017', name: 'Garth Ennis' });
        expect(series.credits.writers).toContainEqual({ identifier: 'nm0471392', name: 'Eric Kripke' });
    });

    test('There are at least the actors Erin and Elisabeth', () => {
        expect(series.credits.cast).toContainEqual({ identifier: 'nm3929195', name: 'Erin Moriarty' });
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0000223', name: 'Elisabeth Shue' });
    });

    test('The number of seasons is undefined', () => {
        expect(series.seasons).toBeUndefined();
    });

    test('List of episodes is undefined"', () => {
        expect(series.episodes).toBeUndefined();
    });
});
