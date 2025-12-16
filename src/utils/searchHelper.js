import { addSecondPoster, addProfilePicture } from "./picturesHelper";
import { getToken, isTokenValid } from "./tokenHelper";

const API_URL = import.meta.env.VITE_API_URL;

export const getSearchedTitles = async (searchString, signal) => {
    let url = `${API_URL}/search/best?`;

    const keyWords = searchString.split(" ");
    let firstWord = true;
    for (const word of keyWords) {
        if (!firstWord) url += "&";
        url += `keyWords=${word}`;
        firstWord = false;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
        signal: signal
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        const newData = await addSecondPoster(data);
        return newData;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error(err);
        return null;
    }
};

export const getSearchedActors = async (searchString, signal) => {
    let url = `${API_URL}/actors/search?page=1&pageSize=8&name=${searchString}`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
        signal: signal
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        const newData = await addProfilePicture(data);
        return newData;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error(err);
        return null;
    }
};

export const postSearchedTitle = async (titleId) => {
    let url = `${API_URL}/search/history/${titleId}`;
    const token = getToken();


    if (!isTokenValid(token)) return;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
    };

    try {
        const res = await fetch(url, options);
        // console.log(res);

        return res;
    } catch (err) {
        console.error(err);
        return null;
    }
}