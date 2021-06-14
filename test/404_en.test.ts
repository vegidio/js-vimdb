import Imdb from '../src';

jest.setTimeout(60_000);
let imdb: Imdb;

beforeAll(async () => {
    imdb = new Imdb('en-US', true);
});

describe('The series does not exist (EN)', () => {
    test('getShow throws an exception', async () => {
        await expect(imdb.getShow('xx0000000')).rejects.toThrow();
    });

    test('getShowCredits throws an exception', async () => {
        await expect(imdb.getShowCredits('xx0000000')).rejects.toThrow();
    });

    test('getSeriesEpisodes throws an exception', async () => {
        await expect(imdb.getSeriesEpisodes('xx0000000')).rejects.toThrow();
    });

    test('getAllShowData throws an exception', async () => {
        await expect(imdb.getAllShowData('xx0000000')).rejects.toThrow();
    });
});
