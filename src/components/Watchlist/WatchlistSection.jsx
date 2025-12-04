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
            
            <p className="text-muted small">
                {watchlist.length} titles
            </p>

            <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                
                {watchlist.map(item => (
                    <div 
                        key={item.id} 
                        className="d-flex bg-white shadow-sm p-3 rounded-3"
                        style={{ gap: "1rem" }}
                    >
                        {/* Poster */}
                        <img 
                            src={item.poster} 
                            alt={item.title} 
                            style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                        />

                        <div className="d-flex flex-column">
                            <h4 className="m-0 fw-bold">{item.title}</h4>
                            <p className="text-muted m-0">{item.year}</p>

                            {item.episodes && (
                                <p className="text-muted small m-0">{item.episodes} episodes</p>
                            )}

                            <p className="mt-2">
                                {item.plot}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
