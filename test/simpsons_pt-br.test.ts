import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Series } from '../src';

let series: Series;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('pt-br', true);
    series = (await imdb.getAllShowData('tt0096697')) as Series;
});

describe('Os Simpsons is correctly scraped (PT-BR)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('Name is "Os Simpsons"', () => {
        expect(series.name).toEqual('Os Simpsons');
    });

    test('Alternative name is "The Simpsons"', () => {
        expect(series.alternativeName).toEqual('The Simpsons');
    });

    test('Summary is not empty', () => {
        expect(series.summary.length).not.toEqual(0);
    });

    test('Description is not empty', () => {
        expect(series.description.length).not.toEqual(0);
    });

    test('Duration is 22 minutes', () => {
        expect(series.duration).toEqual(22);
    });

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).not.toBeNaN();
        expect(series.aggregateRating.ratingCount).not.toBeNaN();
    });

    test('There are 12 recommendations and one is "Uma Família da Pesada"', () => {
        expect(series.recommended.length).toEqual(12);
        expect(series.recommended).toContainEqual({ identifier: 'tt0182576', name: 'Uma Família da Pesada' });
    });

    test('Genres are "Animation" and "Comedy"', () => {
        expect(series.genre).toEqual(['Animation', 'Comedy']);
    });

    test('The content rating is 12', () => {
        expect(series.contentRating).toEqual('12');
    });

    test('The release year is 1989', () => {
        expect(series.year).toEqual(1989);
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

    test('There are at least the directors Mike and Mark', () => {
        expect(series.credits.directors).toContainEqual({ identifier: 'nm0027214', name: 'Mike B. Anderson' });
        expect(series.credits.directors).toContainEqual({ identifier: 'nm0456658', name: 'Mark Kirkland' });
    });

    test('There are at least the writers James and Matt', () => {
        expect(series.credits.writers).toContainEqual({ identifier: 'nm0000985', name: 'James L. Brooks' });
        expect(series.credits.writers).toContainEqual({ identifier: 'nm0004981', name: 'Matt Groening' });
    });

    test('There are at least the actors Hank and Nancy', () => {
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0144657', name: 'Dan Castellaneta' });
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0004813', name: 'Nancy Cartwright' });
    });

    test('There are at least 30 seasons', () => {
        expect(series.seasons).toBeGreaterThan(30);
    });

    test('There are at least 600 episodes and one is "Treehouse of Horror"', () => {
        expect(series.episodes.length).toBeGreaterThan(600);
        expect(series.episodes).toContainEqual(
            expect.objectContaining({ identifier: 'tt0701278', name: 'Treehouse of Horror' }),
        );
    });

    test('All episodes aggregated ratings are valid numbers', () => {
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingValue))).toEqual(true);
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingCount))).toEqual(true);
    });
});
