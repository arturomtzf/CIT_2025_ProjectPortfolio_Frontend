import { useMoviePoster } from "../../hooks/useMoviePoster";

const UpNextItem = ({ movie, isActive }) => {
    const { currentSrc, handleError } = useMoviePoster(
        movie.poster,
        movie.poster2,
        movie.id
    );

    return (
        <div
            className={`d-flex gap-3 p-2 rounded ${isActive ? 'bg-secondary bg-opacity-25 border border-secondary' : 'border border-transparent'} transition-all`}
            style={{ cursor: 'pointer' }}
        >
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                    src={currentSrc}
                    alt={movie.title}
                    className="rounded"
                    style={{
                        width: '70px',
                        height: '100px',
                        objectFit: 'cover',
                        backgroundColor: '#333'
                    }}
                    onError={handleError}
                />
            </div>

            <div className="text-white d-flex flex-column justify-content-center overflow-hidden">
                <h6 className="m-0 fw-bold text-truncate mb-1" style={{ fontSize: '15px' }}>{movie.title}</h6>
                <div className="d-flex align-items-center gap-3 text-secondary" style={{ fontSize: '12px' }}>
                    <span><i className="bi bi-star-fill text-warning me-1"></i>{movie.averageRating || 'N/A'}</span>
                    <span><i className="bi bi-clock me-1"></i>{movie.runTimeInMinutes || 'N/A'}</span>
                </div>
                <div className="mt-2 text-secondary" style={{ fontSize: '11px' }}>
                    {isActive ? <span className="text-warning">Previewing</span> : 'Click to preview'}
                </div>
            </div>
        </div>
    )
};

export default UpNextItem;