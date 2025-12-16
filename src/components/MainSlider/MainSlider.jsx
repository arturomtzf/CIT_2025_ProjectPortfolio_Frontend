import { useState, useEffect } from 'react';
import CurrentMovie from './CurrentMovie';
import UpNextItem from './UpNextItem';
import { addSecondPoster, getPosterPicture } from '../../utils/picturesHelper';

const API_URL = import.meta.env.VITE_API_URL;

const MainSlider = () => {
    const [randomMovies, setRandomMovies] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);

    const changeItem = (index) => {
        setCurrentIndex(index);
    }

    const nextItem = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomMovies.length);
    };

    const prevItem = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? randomMovies.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const getRandomMovies = async () => {
            if (!API_URL) {
                console.warn("API_URL not defined. Using mock data.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/movies/random?page=1&pageSize=4`);
                if (!res.ok) throw new Error("Fetch failed");

                const data = await res.json();
                const newData = await addSecondPoster(data);

                setRandomMovies(newData);
            } catch (error) {
                console.error("Error fetching movies, using fallback:", error);
            }

        }
        getRandomMovies();
    }, []);

    if (!randomMovies) return <div className="text-white p-5">Loading Content...</div>;

    const currentMovie = randomMovies[currentIndex];

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
                />

                <div className="col-12 col-lg-4">
                    <h5 className="text-warning fw-bold mb-3">Up next</h5>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {randomMovies.map((movie, index) => (
                            <div key={movie.id || index} onClick={() => changeItem(index)}>
                                <UpNextItem
                                    movie={movie}
                                    isActive={index === currentIndex}
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