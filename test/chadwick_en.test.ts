import fetch from 'node-fetch';
import * as FileType from 'file-type';
import Imdb, { Person } from '../src';

let person: Person;

beforeAll(async () => {
    jest.setTimeout(60000);
    const imdb = new Imdb('en', true);
    person = await imdb.getPerson('nm1569276');
});

describe('Chadwick Boseman is correctly scraped (EN)', () => {
    test('Name is "Chadwick Boseman"', () => {
        expect(person.name).toEqual('Chadwick Boseman');
    });

    test('Worked as an Actor and Writer', () => {
        expect(person.jobs).toContainEqual('Actor');
        expect(person.jobs).toContainEqual('Writer');
    });

    test('Birthday is 1976-11-29', () => {
        expect(person.birthday).toEqual(new Date(Date.UTC(1976, 11, 29)));
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

    test('Know for "Black Panther" and "Captain America: Civil War"', () => {
        expect(person.filmography.knownFor).toContainEqual({ identifier: 'tt1825683', name: 'Black Panther' });
        expect(person.filmography.knownFor).toContainEqual({
            identifier: 'tt3498820',
            name: 'Captain America: Civil War',
        });
    });

    test('Worked on "42" and "Message from the King"', () => {
        expect(person.filmography.actor).toContainEqual({ identifier: 'tt0453562', name: '42' });
        expect(person.filmography.actor).toContainEqual({ identifier: 'tt1712192', name: 'Message from the King' });
    });

    test('Directed "Heaven" and "Blood Over a Broken Pawn"', () => {
        expect(person.filmography.director).toContainEqual({ identifier: 'tt2402937', name: 'Heaven' });
        expect(person.filmography.director).toContainEqual({
            identifier: 'tt1370151',
            name: 'Blood Over a Broken Pawn',
        });
    });
});
