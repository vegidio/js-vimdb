import Imdb, { Series } from '../src';

let series: Series;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
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
