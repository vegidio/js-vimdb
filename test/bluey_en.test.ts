import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Series } from '../src';

let series: Series;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    series = (await imdb.getAllShowData('tt7678620')) as Series;
});

describe('Bluey is correctly scraped (EN)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('Name is "Bluey"', () => {
        expect(series.name).toEqual('Bluey');
    });

    test('Summary is not empty', () => {
        expect(series.summary.length).not.toEqual(0);
    });

    test('Description is not empty', () => {
        expect(series.description.length).not.toEqual(0);
    });

    test('Duration is 7 minutes', () => {
        expect(series.duration).toEqual(7);
    });

    test('Rating value and count are numbers', () => {
        expect(series.aggregateRating.ratingValue).not.toBeNaN();
        expect(series.aggregateRating.ratingCount).not.toBeNaN();
    });

    test('There are 12 recommendations and one is "Puppy Dog Pals"', () => {
        expect(series.recommended.length).toEqual(12);
        expect(series.recommended).toContainEqual({ identifier: 'tt6688750', name: 'Puppy Dog Pals' });
    });

    test('Genres are "Animation", "Short" and "Family"', () => {
        expect(series.genre).toEqual(['Animation', 'Short', 'Family']);
    });

    test('The content rating is TV-Y', () => {
        expect(series.contentRating).toEqual('TV-Y');
    });

    test('The release year is 2018', () => {
        expect(series.year).toEqual(2018);
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

    test('Director is "Joe Brumm"', () => {
        expect(series.credits.directors).toContainEqual({ identifier: 'nm1068768', name: 'Joe Brumm' });
    });

    test('There are at least the writers John and Tim', () => {
        expect(series.credits.writers).toContainEqual({ identifier: 'nm6066077', name: 'John McGeachin' });
        expect(series.credits.writers).toContainEqual({ identifier: 'nm2155991', name: 'Tim Bain' });
    });

    test('There are at least the actors Melanie and Charlotte', () => {
        expect(series.credits.cast).toContainEqual({ identifier: 'nm3148372', name: 'Melanie Zanetti' });
        expect(series.credits.cast).toContainEqual({ identifier: 'nm6752942', name: 'Charlotte Stent' });
    });

    test('There are at least 2 seasons', () => {
        expect(series.seasons).toBeGreaterThanOrEqual(2);
    });

    test('There are at least 78 episodes and one is "Queens"', () => {
        expect(series.episodes.length).toBeGreaterThanOrEqual(78);
        expect(series.episodes).toContainEqual(expect.objectContaining({ identifier: 'tt12587834', name: 'Queens' }));
    });

    test('All episodes aggregated ratings are valid numbers', () => {
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingValue))).toEqual(true);
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingCount))).toEqual(true);
    });
});
