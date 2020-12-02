import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Person } from '../src';

let person: Person;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    person = await imdb.getPerson('nm0424060');
});

describe('Scarlett Johansson is correctly scraped (EN)', () => {
    test('Name is "Scarlett Johansson"', () => {
        expect(person.name).toEqual('Scarlett Johansson');
    });

    test('Worked as an Actress and Producer', () => {
        expect(person.jobs).toContainEqual('Actress');
        expect(person.jobs).toContainEqual('Producer');
    });

    test('Birthday is 1984-11-22', () => {
        expect(person.birthday).toEqual(new Date(Date.UTC(1984, 11, 22)));
    });

    test('Small and big posters are different', () => {
        expect(person.image.small).not.toEqual(person.image.big);
    });

    test('Small poster is an image', () => {
        return fetch(person.image.small)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('Big poster is an image', () => {
        return fetch(person.image.big)
            .then((response) => response.buffer())
            .then((buffer) => FileType.fromBuffer(buffer))
            .then((fileType) => {
                expect(fileType.mime).toEqual('image/jpeg');
            });
    });

    test('Know for "Lost in Translation" and "The Avengers"', () => {
        expect(person.filmography.knownFor).toContainEqual({ identifier: 'tt0335266', name: 'Lost in Translation' });
        expect(person.filmography.knownFor).toContainEqual({ identifier: 'tt0848228', name: 'The Avengers' });
    });

    test('Worked on "Jojo Rabbit" and "Under the Skin"', () => {
        expect(person.filmography.actor).toContainEqual({ identifier: 'tt2584384', name: 'Jojo Rabbit' });
        expect(person.filmography.actor).toContainEqual({ identifier: 'tt1441395', name: 'Under the Skin' });
    });

    test('Directed "American Express Unstaged: Ellie Goulding" and "These Vagabond Shoes"', () => {
        expect(person.filmography.director).toContainEqual({
            identifier: 'tt5176560',
            name: 'American Express Unstaged: Ellie Goulding',
        });
        expect(person.filmography.director).toContainEqual({ identifier: 'tt1685329', name: 'These Vagabond Shoes' });
    });
});
