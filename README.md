# vegidio/vimdb

[![Actions](https://github.com/vegidio/nodejs-vimdb/workflows/test/badge.svg)](https://github.com/vegidio/nodejs-vimdb/actions)
[![npm](https://img.shields.io/npm/dt/vimdb.svg)](https://www.npmjs.com/package/vimdb)
![TypeScript](https://img.shields.io/npm/types/vimdb.svg)
[![Apache 2.0](https://img.shields.io/badge/license-Apache_License_2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

This package lets you get IMDb information from movies, series, etc without an API key.

## ⚙️ Installation

In your project root folder, enter the following command in the terminal:

```
$ yarn add vimdb
```
or, if you use NPM:

```
$ npm install vimdb
```

## 🤖 Usage

### Get a show by ID

```javascript
// Import the package in your script
import Imdb from 'vimdb'
const imdb = new Imdb('en')

// Get the details of the show "The Simpsons"
imdb.getShowById('tt0096697')
    .then(console.log)

// Get the credits (directors and actors) of the show "Better Call Saul"
imdb.getShowCreditsById('tt3032476')
    .then(show => console.log(show.credits))

// Get the list of episodes of the show "Game of Thrones"
imdb.getShowEpisodesById('tt0944947')
    .then(show => console.log(show.episodes))

// Get the all information (details, credits and episodes) of the show "Cobra Kai"
imdb.getAllShowData('tt7221388')
    .then(console.log);
```

And the response should be something similar to this:

```json
{
    "identifier": "tt0096697",
    "type": "tv_show",
    "name": "Simpsons",
    "alternateName": "The Simpsons",
    "summary": "The satiric adventures of a working-class family in the misfit city of Springfield.",
    "description": "This is an animated sitcom about the antics of a dysfunctional family. Homer is the oafish unhealthy beer loving father, Marge is the hardworking homemaker wife, Bart is the perpetual ten-year-old underachiever (and proud of it), Lisa is the unappreciated eight-year-old genius, and Maggie is the cute, pacifier loving silent infant.",
    "contentRating": 7,
    "duration": 22,
    "genre": [
        "Animation",
        "Comedy"
    ],
    "year": 1989,
    "aggregateRating": {
        "ratingValue": 8.7,
        "ratingCount": 312694
    },
    "recommended": [
        { "identifier": "tt0121955", "name": "South Park" },
        { "identifier": "tt0182576", "name": "Family Guy" },
        { "identifier": "tt0149460", "name": "Futurama" },
        { "identifier": "tt0397306", "name": "American Dad!" },
        { "identifier": "tt0462538", "name": "The Simpsons Movie" },
        { "identifier": "tt0098904", "name": "Seinfeld" },
        { "identifier": "tt0460649", "name": "How I Met Your Mother" },
        { "identifier": "tt0369179", "name": "Two and a Half Men" },
        { "identifier": "tt0898266", "name": "The Big Bang Theory" },
        { "identifier": "tt2861424", "name": "Rick and Morty" },
        { "identifier": "tt0108778", "name": "Friends" },
        { "identifier": "tt0285403", "name": "Scrubs" }
    ],
    "poster": {
        "small": "https://m.media-amazon.com/images/M/MV5BYjFkMTlkYWUtZWFhNy00M2FmLThiOTYtYTRiYjVlZWYxNmJkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "big": "https://m.media-amazon.com/images/M/MV5BYjFkMTlkYWUtZWFhNy00M2FmLThiOTYtYTRiYjVlZWYxNmJkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SY1000_CR0,0,666,1000_AL_.jpg"
     },
    "url": "https://www.imdb.com/title/tt0096697"
}
```

More examples can be found in the `test/` folder on [Github](https://github.com/vegidio/nodejs-vimdb/tree/master/test).

## 📝 License

**vimdb** is released under the Apache License. See [LICENSE](https://github.com/vegidio/nodejs-vimdb/blob/master/LICENSE.txt) for details.

## 👨🏾‍💻 Author

Vinicius Egidio ([vinicius.io](http://vinicius.io))