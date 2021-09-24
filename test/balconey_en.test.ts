import { jest } from '@jest/globals';
import Imdb, { Series } from '../src';

jest.setTimeout(60_000);
let series: Series;

beforeAll(async () => {
    const imdb = new Imdb('en-US', true);
    series = (await imdb.getAllShowData('tt12297330')) as Series;
});

describe('Balcony Stories is correctly scraped (EN)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('Name is "Balcony Stories"', () => {
        expect(series.name).toEqual('Balcony Stories');
    });
});
