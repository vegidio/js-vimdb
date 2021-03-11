import Imdb, { Reference } from '../src';
import { SearchType } from '../src/enums';

let imdb: Imdb;

beforeAll(async () => {
    jest.setTimeout(60000);
    imdb = new Imdb('pt-br', true);
});

describe('Search for "Monica Belllucci" (EN)', () => {
    let results: Reference[];

    beforeAll(async () => {
        results = await imdb.search('Monica Belllucci', SearchType.Name);
    });

    test('There are 3 results', () => {
        expect(results.length).toEqual(3);
    });

    test('One of the results is "Monica Belllucci"', () => {
        expect(results).toContainEqual({ identifier: 'nm0000899', name: 'Monica Bellucci' });
    });
});

describe('Search for "Bob" (EN)', () => {
    let results: Reference[];

    beforeAll(async () => {
        results = await imdb.search('Bob', SearchType.Name);
    });

    test('There are 200 results', () => {
        expect(results.length).toBe(200);
    });

    test('One of the results is "Bob Odenkirk" and "Robert Downey Jr."', () => {
        expect(results).toContainEqual({ identifier: 'nm0644022', name: 'Bob Odenkirk' });
        expect(results).toContainEqual({ identifier: 'nm0000375', name: 'Robert Downey Jr.' });
    });
});
