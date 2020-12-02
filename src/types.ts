/**
 * Represents a reference to a Show or Person.
 */
type Reference = {
    /** Unique identifier for movies, series or people */
    identifier: string;

    /** Name of the show or person */
    name: string;
};

/**
 * Represents a reference to a Episode.
 */
type EpisodeReference = Reference & {
    /** The episode's season */
    season: number;

    /** The episode's number */
    number: number;

    /** Summary of the episode */
    summary: string;

    aggregateRating: {
        /** The mean value of all votes given to the episode */
        ratingValue: number;

        /** The number of votes given to the episode */
        ratingCount: number;
    };
};

export { Reference, EpisodeReference };
