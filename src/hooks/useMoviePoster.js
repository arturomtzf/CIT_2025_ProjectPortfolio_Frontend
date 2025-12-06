import { useState, useEffect } from 'react';

const FALLBACK_POSTER = 'https://cataas.com/cat';

export const useMoviePoster = (primaryPoster, secondaryPoster, resetKey) => {
    const [errorLevel, setErrorLevel] = useState(0);

    // Reset error level when the movie/item changes
    useEffect(() => {
        setErrorLevel(0);
    }, [resetKey]);

    const handleError = () => {
        setErrorLevel(prev => Math.min(prev + 1, 2));
    };

    const getPosterSrc = () => {
        if (errorLevel === 0 && primaryPoster) return primaryPoster;
        if (errorLevel <= 1 && secondaryPoster) return secondaryPoster;
        return FALLBACK_POSTER;
    };

    const currentSrc = getPosterSrc();

    return { currentSrc, handleError };
};