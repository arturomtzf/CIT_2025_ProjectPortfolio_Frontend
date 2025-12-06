import { Link } from 'react-router-dom';

const CurrentMovie = ({ currentMovie, nextItem, prevItem, posterSrc, onImageError }) => {
    return (
        <div className="col-12 col-lg-8 mb-4 mb-lg-0">
            <div
                className="position-relative overflow-hidden rounded shadow-lg"
                style={{ height: '500px' }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${posterSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(20px) brightness(0.4)',
                        zIndex: 0
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${posterSrc})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 1
                    }}
                />

                <img
                    src={posterSrc}
                    onError={onImageError}
                    style={{ display: 'none' }}
                    alt="hidden-loader"
                />

                <div
                    className="position-absolute w-100 h-100"
                    style={{
                        zIndex: 2,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)'
                    }}
                >
                    <div className="h-100 d-flex flex-column justify-content-end p-4">
                        <div className="text-white position-relative">
                            <h1 className="fw-bolder mb-2 display-6 text-shadow">
                                {currentMovie.title}
                            </h1>

                            <div className="d-flex align-items-center gap-2 mb-2">
                                <Link to={'/title/' + currentMovie.id} className="text-decoration-none">
                                    <span className="text-warning fw-bold fs-5 hover-underline">
                                        Watch movie details <i className="bi bi-arrow-right-circle ms-1"></i>
                                    </span>
                                </Link>
                            </div>

                            <small className="text-secondary d-flex align-items-center gap-3 fs-6">
                                <span><i className="bi bi-eye-fill me-1"></i>{currentMovie.numVotes?.toLocaleString() ?? 'N/A'} Votes</span>
                                <span><i className="bi bi-clock-fill me-1"></i>{currentMovie.runTimeInMinutes?.toLocaleString() ?? 'N/A'} Minutes</span>
                            </small>
                        </div>
                    </div>

                    <button
                        onClick={prevItem}
                        className="btn position-absolute top-50 start-0 translate-middle-y text-white fs-2 p-3"
                        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 100%)', border: 'none', height: '100px' }}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    <button
                        onClick={nextItem}
                        className="btn position-absolute top-50 end-0 translate-middle-y text-white fs-2 p-3"
                        style={{ background: 'linear-gradient(-90deg, rgba(0,0,0,0.8) 0%, transparent 100%)', border: 'none', height: '100px' }}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CurrentMovie;