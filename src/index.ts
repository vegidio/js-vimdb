import Imdb from './controllers/Imdb';
import Movie from './models/movie.model';
import Series from './models/series.model';
import Person from './models/person.model';
import type { Reference, EpisodeReference } from './types';

export { Reference, EpisodeReference };
export { Movie, Series, Person };
export default Imdb;
