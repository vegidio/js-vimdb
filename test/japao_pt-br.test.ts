import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Movie } from '../src';

let movie: Movie;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('pt-br', true);
    movie = (await imdb.getAllShowData('tt0194149')) as Movie;
});

describe('Meu Japão Brasileiro is correctly scraped (PT-BR)', () => {
    test('The show is a Movie', () => {
        expect(movie).toBeInstanceOf(Movie);
    });

    test('Name is "Meu Japão Brasileiro"', () => {
        expect(movie.name).toEqual('Meu Japão Brasileiro');
    });

    test('Summary is not empty', () => {
        expect(movie.summary.length).not.toEqual(0);
    });

    test('Description is not empty', () => {
        expect(movie.description.length).not.toEqual(0);
    });

    test('Duration is 102 minutes', () => {
        expect(movie.duration).toEqual(102);
    });

    test('Rating value and count are numbers', () => {
        expect(movie.aggregateRating.ratingValue).not.toBeNaN();
        expect(movie.aggregateRating.ratingCount).not.toBeNaN();
    });

    test('Genre is "Comedy"', () => {
        expect(movie.genre).toEqual(['Comedy']);
    });

    test('The release year is 1964', () => {
        expect(movie.year).toEqual(1964);
    });

    test('Small and big posters are different', () => {
        expect(movie.image.small).not.toEqual(movie.image.big);
    });

    test('Small poster is an image', () => {
        return fetch(movie.image.small)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('Big poster is an image', () => {
        return fetch(movie.image.big)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('Director is Glauco Mirko Laurelli', () => {
        expect(movie.credits.directors).toContainEqual({ identifier: 'nm0491049', name: 'Glauco Mirko Laurelli' });
    });

    test('There are at least the writers Amácio and Gentil', () => {
        expect(movie.credits.writers).toContainEqual({ identifier: 'nm0563509', name: 'Amácio Mazzaropi' });
        expect(movie.credits.writers).toContainEqual({ identifier: 'nm0735107', name: 'Gentil Rodrigues' });
    });

    test('There are at least the actors Geny and Zilda', () => {
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm0695024', name: 'Geny Prado' });
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm0136702', name: 'Zilda Cardoso' });
    });
});
