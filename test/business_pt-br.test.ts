import { jest } from '@jest/globals';
import fetch from 'node-fetch';
import FileType from 'file-type';
import Imdb, { Series } from '../src';

jest.setTimeout(60_000);
let series: Series;

beforeAll(async () => {
    const imdb = new Imdb('pt-BR', true);
    series = (await imdb.getAllShowData('tt2650940')) as Series;
});

describe('O Negócio is correctly scraped (PT-BR)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('Name is "O Negócio"', () => {
        expect(series.name).toEqual('O Negócio');
    });

    test('Summary is correct', () => {
        expect(series.summary).toContain('Karin, Magali and Luna are three call girls');
    });

    test('Description is correct', () => {
        expect(series.description).toContain('Marketing is the soul of any business');
    });

    test('Duration is 51 minutes', () => {
        expect(series.duration).toEqual(47);
    });

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).toBeGreaterThan(4);
        expect(series.aggregateRating.ratingCount).toBeGreaterThan(1_000);
    });

    test('There are 12 recommendations and one is "Magnífica 70"', () => {
        expect(series.recommended.length).toEqual(12);
        expect(series.recommended).toContainEqual({ identifier: 'tt4725820', name: 'Magnífica 70' });
    });

    test('Genres are "Comedy" and "Drama"', () => {
        expect(series.genre).toEqual(['Comedy', 'Drama']);
    });

    test('The content rating is 16', () => {
        expect(series.contentRating).toEqual('16');
    });

    test('The release year is 2013', () => {
        expect(series.year).toEqual(2013);
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

    test('There are at least the directors Michel and Júlia', () => {
        expect(series.credits.directors).toContainEqual({ identifier: 'nm2633637', name: 'Michel Tikhomiroff' });
        expect(series.credits.directors).toContainEqual({ identifier: 'nm1155504', name: 'Júlia Pacheco Jordão' });
    });

    test('There are at least the writers Rodrigo and Fabio', () => {
        expect(series.credits.writers).toContainEqual({ identifier: 'nm2639477', name: 'Rodrigo Castilho' });
        expect(series.credits.writers).toContainEqual({ identifier: 'nm1992562', name: 'Fabio Danesi' });
    });

    test('There are at least the actors Rafaela and Juliana', () => {
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0973465', name: 'Rafaela Mandelli' });
        expect(series.credits.cast).toContainEqual({ identifier: 'nm3170472', name: 'Juliana Schalch' });
    });

    test('There are 4 seasons', () => {
        expect(series.seasons).toEqual(4);
    });

    test('There are 51 episodes and one is "Acordo"', () => {
        expect(series.episodes.length).toEqual(51);
        expect(series.episodes).toContainEqual(expect.objectContaining({ identifier: 'tt4030492', name: 'Acordo' }));
    });

    test('All episodes aggregated ratings are valid numbers', () => {
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingValue))).toEqual(true);
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingCount))).toEqual(true);
    });
});
