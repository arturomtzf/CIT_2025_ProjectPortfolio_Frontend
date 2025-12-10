import { useEffect, useState } from "react";
import SidebarSection from "./SidebarSection";
import { Link } from "react-router-dom";


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

    const handleRemove = async (titleId) => {
        try{
            const token = localStorage.getItem("token")
            if(!token) {
            return alert("You need to be logged in")
        }

        const res = await fetch(`${API_URL}/bookmarks/movies/${titleId}`, {
            method: "DELETE",
            headers:  {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        if(!res.ok) {
            alert("Failed to delete a title from the watchlist")
            return
        }

        setWatchlist(prev => prev.filter(item => item.titleid !== titleId))

        }
        catch(err)
        {
            console.log(err)
            alert("Could not remove title")
        }
        
    }

    if (loading) return <p>Loading your watchlist...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;


    return (
        <div className="container my-4">
            <div className="row">
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
                            className="d-flex bg-white shadow-sm p-3 rounded-3 position-relative"
                            style={{ gap: "1rem", display: "flex" }}
                        >
                        <div className="d-flex flex-column" style={{ width: "100px" }}>
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
                            <button className="btn btn-danger btn-sm  " style={{
                                        
                                        marginTop: "10px",
                                        padding: "2px 6px",
                                        fontSize: "0.75rem",
                                        backgroundColor: "#F5C518",
                                        borderRadius: "4px",
                                        color: "#000000ff",
                                        border: "none",
                                        width: "70%",
                                        
                                        
                                    }} onClick={() =>handleRemove(item.titleid)}>Remove</button>
                            </div>

                            <div className="d-flex flex-column flex-grow-1">
                                <Link to={`/title/${item.titleid}`} className="text-decoration-none">
                                    <h4 className="m-0 fw-bold" style={{color: '#000'}}
                                    onMouseEnter={e => e.currentTarget.style.color = "#575656ff"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#000000ff"}>{title}</h4>
                                </Link>
                                
                                <p className="text-muted m-0">
                                {year}  
                                {titleType && ` -  ${titleType}`}
                                {episodes && ` -  ${episodes} episodes`} 
                             </p>

                                <p className="mt-2" style={{color: '#000'}}>{plot}</p>

                                
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>


            
            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                <SidebarSection totalTitles = {watchlist.length}/>
            </div>
            </div>

            
        </div>
    );
}
