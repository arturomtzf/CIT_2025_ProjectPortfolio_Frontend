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
            <div className="col-12 col-lg-8">
                <p className="text">{watchlist.length} titles</p>

            <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                {watchlist.map(item => {
                    const title = item.titlename || "No Title";

                    const poster = item.poster || null;
                     
                    const titleType = item.titleTypeName
                    ? item.titleTypeName
                    .replace(/([A-Z])/g, ' $1')   
                    .replace(/^./, c => c.toUpperCase()) 
                     : "";

                    const year = item.releaseDate
                    ? new Date(item.releaseDate).getFullYear()
                     : "Unknown Year";

                    const episodes = item.numEpisodes || null;

                    const plot = item.plot || item.Plot || "No description available";

                    return (
                        <div
                            key={item.id || title}
                            className="d-flex bg-white shadow-sm p-3 rounded-3"
                            style={{ gap: "1rem" }}
                        >
                            <img
                                src={poster}
                                alt={title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://www.popcorn.app/assets/app/images/placeholder-movieimage.png";
                                }}
                                style={{
                                    width: "100px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                }}
                            />


                            <div className="d-flex flex-column">
                                <h4 className="m-0 fw-bold">{title}</h4>
                                <p className="text-muted m-0">
                                {year}  
                                {titleType && ` -  ${titleType}`}
                                {episodes && ` -  ${episodes} episodes`} 
                             </p>

                                <p className="mt-2">{plot}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            
        </div>
    );
}
