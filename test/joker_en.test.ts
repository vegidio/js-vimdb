import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Movie } from '../src';

let movie: Movie;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    movie = (await imdb.getAllShowData('tt7286456', { episodes: false })) as Movie;
});

describe('Joker is correctly scraped (EN)', () => {
    test('The show is a Movie', () => {
        expect(movie).toBeInstanceOf(Movie);
    });

    test('Name is "Joker"', () => {
        expect(movie.name).toEqual('Joker');
    });

    test('Summary is not empty', () => {
        expect(movie.summary.length).not.toEqual(0);
    });

    test('Description is not empty', () => {
        expect(movie.description.length).not.toEqual(0);
    });

    test('Duration is 122 minutes', () => {
        expect(movie.duration).toEqual(122);
    });

    test('Rating value and count are numbers', () => {
        expect(movie.aggregateRating.ratingValue).not.toBeNaN();
        expect(movie.aggregateRating.ratingCount).not.toBeNaN();
    });

    test('There are 12 recommendations and one is "The Dark Knight"', () => {
        expect(movie.recommended.length).toEqual(12);
        expect(movie.recommended).toContainEqual({ identifier: 'tt0468569', name: 'The Dark Knight' });
    });

    test('Genres are "Crime", "Drama" and "Thriller"', () => {
        expect(movie.genre).toEqual(['Crime', 'Drama', 'Thriller']);
    });

    test('The content rating is R', () => {
        expect(movie.contentRating).toEqual('R');
    });

    test('The release year is 2019', () => {
        expect(movie.year).toEqual(2019);
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

    test('Director is Todd Phillips', () => {
        expect(movie.credits.directors).toContainEqual({ identifier: 'nm0680846', name: 'Todd Phillips' });
    });

    test('There are at least the writers Scott and Bob', () => {
        expect(movie.credits.writers).toContainEqual({ identifier: 'nm0798788', name: 'Scott Silver' });
        expect(movie.credits.writers).toContainEqual({ identifier: 'nm0004170', name: 'Bob Kane' });
    });

    test('There are at least the actors Joaquin and Robert', () => {
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm0001618', name: 'Joaquin Phoenix' });
        expect(movie.credits.cast).toContainEqual({ identifier: 'nm0000134', name: 'Robert De Niro' });
    });
});
