import Imdb, { Series } from '../src';

let series: Series;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    series = (await imdb.getAllShowData('tt8111088', { main: false })) as Series;
});

describe('The Mandalorian is correctly scraped (EN)', () => {
    test('The show is a Series', () => {
        expect(series).toBeInstanceOf(Series);
    });

    test('There are at least the directors Taika and Dave', () => {
        expect(series.credits.directors).toContainEqual({ identifier: 'nm0169806', name: 'Taika Waititi' });
        expect(series.credits.directors).toContainEqual({ identifier: 'nm1396048', name: 'Dave Filoni' });
    });

    test('There are at least the writers George and Jon', () => {
        expect(series.credits.writers).toContainEqual({ identifier: 'nm0000184', name: 'George Lucas' });
        expect(series.credits.writers).toContainEqual({ identifier: 'nm0269463', name: 'Jon Favreau' });
    });

    test('There are at least the actors Pedro and Rio', () => {
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0050959', name: 'Pedro Pascal' });
        expect(series.credits.cast).toContainEqual({ identifier: 'nm0352513', name: 'Rio Hackford' });
    });

    test('There is at least 1 season', () => {
        expect(series.seasons).toBeGreaterThanOrEqual(1);
    });

    test('There are at least 8 episodes and one is "The Child"', () => {
        expect(series.episodes.length).toBeGreaterThanOrEqual(8);
        expect(series.episodes).toContainEqual(
            expect.objectContaining({ identifier: 'tt9121530', name: 'Chapter 2: The Child' }),
        );
    });

    test('All episodes aggregated ratings are valid numbers', () => {
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingValue))).toEqual(true);
        expect(series.episodes.every((ep) => !Number.isNaN(ep.aggregateRating.ratingCount))).toEqual(true);
    });
});
