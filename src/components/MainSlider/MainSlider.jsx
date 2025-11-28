import { useState, useEffect } from 'react';
import CurrentMovie from './CurrentMovie';
import UpNextItem from './UpNextItem';

const FALLBACK_POSTER = 'https://cataas.com/cat';
const API_URL = import.meta.env.VITE_API_URL;
const MOCK_TRAILERS = [
    {
        "id": "tt10041958",
        "title": "In Our Blood - El Legado, Jorge Lorenzo",
        "runTimeInMinutes": null,
        "numVotes": 10,
        "averageRating": 8.7,
        "poster": "https://m.media-amazon.com/images/M/MV5BNGI4NDExNmUtYjdhNS00Nzc2LWFhMzItNGEwOWM2MzBkNGQ4XkEyXkFqcGdeQXVyOTA3MDkxNTQ@._V1_SX300.jpg"
    },
    {
        "id": "tt33060407",
        "title": "Marcella",
        "runTimeInMinutes": 97,
        "numVotes": 57,
        "averageRating": 8.2,
        "poster": "https://m.media-amazon.com/images/M/MV5BYzhkOWVjZGYtMmMzNS00MTAxLWE1ZjMtZDcxZTNiOTVmZDM3XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "id": "tt36143683",
        "title": "Piot",
        "runTimeInMinutes": 72,
        "numVotes": 21,
        "averageRating": 9.0,
        "poster": "https://m.media-amazon.com/images/M/MV5BMmFlZjAzMTktMmZmMS00ZDE4LTlkZjAtY2ZlNzQ0ZmU2NDZjXkEyXkFqcGc@._V1_SX300.jpg"
    },
];

const MainSlider = () => {
    const [randomMovies, setRandomMovies] = useState(MOCK_TRAILERS);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextItem = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomMovies.length);
    };

    const prevItem = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? randomMovies.length - 1 : prevIndex - 1
        );
    };

    const handleImageError = (index) => {
        setRandomMovies(prevMovies => {
            const newMovies = [...prevMovies];
            if (newMovies[index].poster !== FALLBACK_POSTER) {
                newMovies[index] = { ...newMovies[index], poster: FALLBACK_POSTER };
            }
            return newMovies;
        });
    };

    useEffect(() => {
        const getRandomMovies = async () => {
            if (!API_URL) {
                console.warn("API_URL not defined. Using mock data.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/movies/random`);
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                // Only update if we actually got an array
                if (Array.isArray(data) && data.length > 0) {
                    setRandomMovies(data);
                }
            } catch (error) {
                console.error("Error fetching movies, using fallback:", error);
            } finally {

            }
        }
        getRandomMovies();
    }, []);

    const currentMovie = randomMovies[currentIndex];

    if (!currentMovie) return <div className="text-white p-5 text-center">Loading Content...</div>;

    return (
        <div className="container py-5" style={{ backgroundColor: '#000000' }}>
            <div className="d-flex align-items-center mb-4 border-start border-4 border-warning ps-3">
                <h3 className="text-white fw-bold m-0">Featured Today</h3>
            </div>

            <div className="row justify-content-center gx-5">
                <CurrentMovie
                    currentMovie={currentMovie}
                    nextItem={nextItem}
                    prevItem={prevItem}
                    onImageError={() => handleImageError(currentIndex)}
                    FALLBACK_POSTER={FALLBACK_POSTER}
                />

                <div className="col-12 col-lg-4">
                    <h5 className="text-warning fw-bold mb-3">Up next</h5>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {randomMovies.map((movie, index) => (
                            <div key={movie.id || index} onClick={() => setCurrentIndex(index)}>
                                <UpNextItem
                                    movie={movie}
                                    isActive={index === currentIndex}
                                    onImageError={() => handleImageError(index)}
                                    FALLBACK_POSTER={FALLBACK_POSTER}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainSlider;