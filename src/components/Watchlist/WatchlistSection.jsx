import { useEffect, useState } from "react";

export default function WatchlistSection() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

        
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("You must be logged in to view your watchlist.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_URL}/bookmarks/movies`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    setError("Failed to load watchlist.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log("Watchlist data: ", data)
                setWatchlist(data);
            } catch (err) {
                setError("Network error. Could not load watchlist.");
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

    if (loading) return <p>Loading your watchlist...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;



    
    return (
        <div className="container my-4">
            {/* Watchlist Header */}
            <p className="text-muted small">{watchlist.length} titles</p>

            {/* Watchlist Items */}
            <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                {watchlist.map(item => {
                    // Use fallback values if property names differ
                    const title = item.titlename || item.titleid || "No Title";
                    const poster = item.poster || item.PosterURL || "https://via.placeholder.com/100x150";
                    const year = item.year || item.Year || "Unknown Year";
                    const episodes = item.episodes || item.Episodes || null;
                    const plot = item.plot || item.Plot || "No description available";

                    return (
                        <div
                            key={item.id || title}
                            className="d-flex bg-white shadow-sm p-3 rounded-3"
                            style={{ gap: "1rem" }}
                        >
                            {/* Poster */}
                            <img
                                src={poster}
                                alt={title}
                                style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                            />

                            {/* Movie Info */}
                            <div className="d-flex flex-column">
                                <h4 className="m-0 fw-bold">{title}</h4>
                                <p className="text-muted m-0">{year}</p>

                                {episodes && (
                                    <p className="text-muted small m-0">{episodes} episodes</p>
                                )}

                                <p className="mt-2">{plot}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
