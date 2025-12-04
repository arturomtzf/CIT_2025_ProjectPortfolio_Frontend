import { useState, useEffect } from 'react';
import TopPickItem from './TopPickItem';

const API_URL = import.meta.env.VITE_API_URL;
// --- MOCK DATA ---
const TOP_PICKS_DATA = [
    { id: 1, title: 'Peaky Blinders', averageRating: 8.7, poster: 'https://cataas.com/cat' },
    { id: 2, title: 'Severance', averageRating: 8.7, poster: 'https://cataas.com/cat' },
    { id: 3, title: 'Prison Break', averageRating: 8.3, poster: 'https://cataas.com/cat' },
    { id: 4, title: 'Attack on Titan', averageRating: 9.1, poster: 'https://cataas.com/cat' },
    { id: 5, title: 'Better Call Saul', averageRating: 9.0, poster: 'https://cataas.com/cat' },
    { id: 6, title: 'The Office', averageRating: 8.9, poster: 'https://cataas.com/cat' },
    { id: 7, title: 'Breaking Bad', averageRating: 8.9, poster: 'https://cataas.com/cat' },
];

// --- MAIN COMPONENT ---
const TopPicks = () => {
    const [topPics, setTopPicks] = useState(TOP_PICKS_DATA);

    useEffect(() => {
        const getPeopleBornToday = async () => {
            if (!API_URL) {
                console.warn("API_URL not defined. Using mock data.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/movies/popular?page=1&pageSize=100`);
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                // Only update if we actually got an array
                if (Array.isArray(data) && data.length > 0) {
                    setTopPicks(data);
                }
            } catch (error) {
                console.error("Error fetching top picks, using fallback:", error);
            } finally {

            }
        }
        getPeopleBornToday();
    }, []);

    return (
        <div className="py-4" style={{ backgroundColor: '#000000' }}>
            <div className="container">

                {/* Main Section Title */}
                <h3 className="text-warning fw-bold mb-3">What to watch</h3>

                {/* Sub-header with "Top picks" */}
                <div className="mb-4">
                    <h3 className="text-white fw-bold d-flex align-items-center mb-1" style={{ borderLeft: '4px solid #f5c518', paddingLeft: '12px' }}>
                        Top picks
                    </h3>
                    <p className="text-secondary ms-3 mb-0">
                        TV shows and movies just for you
                    </p>
                </div>

                {/* Horizontal Scrolling List */}
                <div
                    className="d-flex overflow-auto pb-4"
                    style={{
                        gap: '1.5rem',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#333 #000'
                    }}
                >
                    {topPics.map((item) => (
                        <TopPickItem key={item.id} item={item} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TopPicks;