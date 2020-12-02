import Imdb, { Movie } from '../src';

let movie: Movie;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb();
    movie = await imdb.getAllShowData('tt3135462');
});

describe('I otsy, i deti is correctly scraped (EN)', () => {
    test('The show is a Movie', () => {
        expect(movie).toBeInstanceOf(Movie);
    });

    test('Name is "I otsy, i deti"', () => {
        expect(movie.name).toEqual('I otsy, i deti');
    });

    test('The release year is 2013', () => {
        expect(movie.year).toEqual(2013);
    });

    test('Director is Feliks Gerchikov', () => {
        expect(movie.credits.directors).toContainEqual({ identifier: 'nm3703121', name: 'Feliks Gerchikov' });
    });

    test('Writer is Rauf Kubayev', () => {
        expect(movie.credits.writers).toContainEqual({ identifier: 'nm1195196', name: 'Rauf Kubayev' });
    });

    test('There are at least the actors Natalya and Anastasiya', () => {
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm4284119', name: 'Natalya Bochkareva' });
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm1506431', name: 'Anastasiya Makeeva' });
    });
});
