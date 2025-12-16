import { Link } from "react-router-dom";
import { useMoviePoster } from "../../hooks/useMoviePoster";

// This is Andrea's component. I am just refactoring
const WatchlistItem = ({ item, setWatchlist }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const TRASH_CAN = 'https://img.icons8.com/fluent-systems-regular/512/FA5252/trash.png'
    const title = item.titlename || "No Title";

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

    const { currentSrc, handleError } = useMoviePoster(
        item.poster,
        item.poster2,
        item.titleId
    )

    const handleRemove = async (titleId) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                return alert("You need to be logged in")
            }

            const res = await fetch(`${API_URL}/bookmarks/movies/${titleId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (!res.ok) {
                alert("Failed to delete a title from the watchlist")
                return
            }

            setWatchlist(prev => prev.filter(item => item.titleid !== titleId))

        }
        catch (err) {
            console.log(err)
            alert("Could not remove title")
        }
    }

    return (
        <div
            key={item.id || title}
            className="d-flex bg-white shadow-sm p-3 rounded-3"
            style={{ gap: "1rem", position: "relative" }}
        >
            <div className="d-flex flex-column" style={{ width: "100px" }}>
                <img
                    src={currentSrc}
                    onError={handleError}
                    style={{
                        width: "100px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px"
                    }}
                />

            </div>

            <div className="d-flex flex-column flex-grow-1">
                <Link to={`/title/${item.titleid}`} className="text-decoration-none">
                    <h4 className="m-0 fw-bold" style={{ color: '#000' }}
                        onMouseEnter={e => e.currentTarget.style.color = "#575656ff"}
                        onMouseLeave={e => e.currentTarget.style.color = "#000000ff"}>{title}</h4>
                </Link>

                <p className="text-muted m-0">
                    {year}
                    {titleType && ` -  ${titleType}`}
                    {episodes && ` -  ${episodes} episodes`}
                </p>


                <p className="mt-2" style={{ color: '#000' }}>{plot}</p>

            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                    src={TRASH_CAN}
                    alt="Remove"
                    style={{ width: "24px", height: "24px", cursor: "pointer" }}
                    onClick={() => handleRemove(item.titleid)}
                />

            </div>
        </div>
    );
}

export default WatchlistItem;