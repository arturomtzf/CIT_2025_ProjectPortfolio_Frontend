import { getToken, isTokenValid } from "./tokenHelper";
const API_URL = import.meta.env.VITE_API_URL;

export const handleBookmarkMovies = async (titleId, bookmarkExists) => {
    let url = `${API_URL}/bookmarks/movies/${titleId}`;
    const token = getToken();

    if (!isTokenValid(token)) return false;

    const options = {
        method: bookmarkExists ? 'DELETE' : 'POST',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
    };

    try {
        const res = await fetch(url, options);

        if (res.status === 409) {
            return true;
        }

        if (!res.ok) {
            throw new Error("Failed to handle bookmark.");
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}