const THEMOVIEDB_TOKEN = import.meta.env.VITE_THEMOVIEDB_TOKEN;

export const getProfilePicture = async (name) => {
    const url = `https://api.themoviedb.org/3/search/person?query=${name}&include_adult=false&language=en-US&page=1`;

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

        return data?.results?.[0]?.profile_path || null;

    } catch (err) {
        console.error(err);
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