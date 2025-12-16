import { useEffect, useState } from "react";
import { addSecondPoster } from "../../utils/picturesHelper";
import SidebarSection from "./SidebarSection";
import WatchlistItem from "./WatchlistItem";


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
                const newData = await addSecondPoster(data)

                setWatchlist(newData);
                localStorage.setItem("titleCount", data.length)
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
            <div className="row">
                <div className="col-12 col-lg-8">
                    <p className="text">{watchlist.length} titles</p>

                    <div className="d-flex flex-column mt-4" style={{ gap: "1.5rem" }}>
                        {watchlist.map(item => <WatchlistItem item={item} setWatchlist={setWatchlist}/>)}
                    </div>
                </div>



                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                    <SidebarSection totalTitles={watchlist.length} />
                </div>
            </div>


        </div>
    );
}
