import { Link } from "react-router-dom";
import { useMoviePoster } from "../../hooks/useMoviePoster";

const ActivityItem = ({ item }) => {
    const { currentSrc, handleError } = useMoviePoster(
        item.poster,
        item.poster2,
        item.titleId
    )

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

    return (
        <div
            key={item.id || title}
            className="d-flex bg-white shadow-sm p-3 rounded-3 position-relative"
            style={{ gap: "1rem", display: "flex" }}
        >
            <div className="d-flex flex-column" style={{ width: "100px" }}>
                <img
                    src={currentSrc}
                    onError={handleError}
                    alt={"poster"}
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
        </div>
    );
}

export default ActivityItem;