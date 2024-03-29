import { jest } from '@jest/globals';
import Imdb, { Reference } from '../src';

jest.setTimeout(60_000);
let imdb: Imdb;

beforeAll(async () => {
    imdb = new Imdb('en-US', true);
});

describe('Search for "Dragon Ball" (EN)', () => {
    let results: Reference[];

    beforeAll(async () => {
        results = await imdb.search('Dragon Ball');
    });

    test('There are 175 results', () => {
        expect(results.length).toBeGreaterThanOrEqual(175);
    });

    test('One of the results is "Dragon Ball Z"', () => {
        expect(results).toContainEqual({ identifier: 'tt0121220', name: 'Dragon Ball Z' });
    });
});

describe('Search for "Presença de Anita" (EN)', () => {
    let results: Reference[];

    beforeAll(async () => {
        results = await imdb.search('Presença de Anita');
    });

    test('There are 18 results', () => {
        expect(results.length).toBeGreaterThanOrEqual(18);
    });

    test('One of the results is "Presença de Anita"', () => {
        expect(results).toContainEqual({ identifier: 'tt0287262', name: 'Presença de Anita' });
    });
});

describe('Search for "Две девицы на мели" (EN)', () => {
    let results: Reference[];

    beforeAll(async () => {
        results = await imdb.search('Две девицы на мели');
    });

    test('There is 1 result', () => {
        expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('One of the results is "Две девицы на мели"', () => {
        expect(results).toContainEqual({ identifier: 'tt1845307', name: '2 Broke Girls' });
        expect(results).toContainEqual({ identifier: 'tt11715972', name: '2 Broke Girls' });
    });
});
