import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopPickItem = ({ item }) => {
    // State to track if the image failed to load
    const [imageError, setImageError] = useState(false);

    const isImageMissing = !item.poster || imageError;
    const FALLBACK_POSTER = 'https://cataas.com/cat';

    const FallbackPoster = (
        <img
            src={FALLBACK_POSTER}
            alt={FALLBACK_POSTER}
            className="w-100 rounded-1"
            style={{ height: '270px', objectFit: 'cover', cursor: 'pointer' }}
        />
    );

    const PosterImage = (
        <img
            src={item.poster}
            alt={item.title}
            className="w-100 rounded-1"
            style={{ height: '270px', objectFit: 'cover', cursor: 'pointer' }}
            onError={() => setImageError(true)}
        />
    );


    return (
        <div className="d-flex flex-column" style={{ width: '185px', flexShrink: 0 }}>
            <Link to={`/title/${item.id}`} className="position-relative mb-2">
                {isImageMissing ? FallbackPoster : PosterImage}
            </Link>

            <div className="d-flex flex-column flex-grow-1">
                <div className="d-flex align-items-center mb-2" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span className="text-white me-3">{item.averageRating}</span>
                </div>

                {/* Title */}
                <h6 className="text-white fw-bold text-truncate mb-2" title={item.title}>
                    <Link to={`/title/${item.id}`} className="text-white text-decoration-none hover-underline">
                        {item.title}
                    </Link>
                </h6>

                <button
                    className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
                    style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3c3c3c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2c2c2c'}
                >
                    <i className="bi bi-plus-lg me-2"></i> Watchlist
                </button>
            </div>
        </div>
    );
};

export default TopPickItem;