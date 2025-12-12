const THEMOVIEDB_TOKEN = import.meta.env.VITE_THEMOVIEDB_TOKEN;

// Simple in-memory cache to avoid repeating TMDB lookups during a session.
// Keyed by the provided `name` (usually personId or identifier used by the app).
const _profileCache = new Map();

export const getProfilePicture = async (name) => {
    if (!name) return null;
    // return cached value if present (could be null meaning previous miss)
    if (_profileCache.has(name)) return _profileCache.get(name);
    // const url = `https://api.themoviedb.org/3/search/person?query=${name}&include_adult=false&language=en-US&page=1`;
    const url = `https://api.themoviedb.org/3/find/${name}?external_source=imdb_id&api_key=fb98335fca6f74842467a37d1a1a2070`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + THEMOVIEDB_TOKEN
        }
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();

        const result = data?.person_results?.[0]?.profile_path || null;
        // cache the result (could be null)
        _profileCache.set(name, result);
        return result;
    } catch (err) {
        console.error(err);
        // cache miss as null to avoid immediate retries
        _profileCache.set(name, null);
        return null;
    }
};

export const getPosterPicture = async (name) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + THEMOVIEDB_TOKEN
        }
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();

        for (const element of data.results) {
            if (element.poster_path) {
                return element.poster_path;
            }
        }

        return null;

    } catch (err) {
        console.error(err);
        return null;
    }
};

export const addSecondPoster = async (data) => {
    if (Array.isArray(data) && data.length > 0) {
        const updatedMovies = [];

        for (const movie of data) {
            const movieCopy = { ...movie };
            const secondPoster = await getPosterPicture(movie.title);

            movieCopy.poster2 = secondPoster
                ? "https://image.tmdb.org/t/p/w600_and_h900_face/" + secondPoster
                : null;

            updatedMovies.push(movieCopy);
        }

        return updatedMovies;
    }
    return data;
}

export const addProfilePicture = async (data) => {
    if (Array.isArray(data) && data.length > 0) {
        const updatedActors = [];

        for (const actor of data) {
            const actorCopy = { ...actor };
            const picture = await getProfilePicture(actor.personId);

            actorCopy.picture = picture
                ? "https://image.tmdb.org/t/p/w300_and_h450_face/" + picture
                : null;

            updatedActors.push(actorCopy);
        }

        return updatedActors;
    }
    return data;
}