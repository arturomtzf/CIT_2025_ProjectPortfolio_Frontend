import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { useMoviePoster } from '../../hooks/useMoviePoster';
import { getPosterPicture } from '../../utils/picturesHelper';

const API_URL = import.meta.env.VITE_API_URL;

export default function ToppicksSection({ title = 'Top Picks', pageSize = 8 }) {
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const getPopular = async () => {
            setLoading(true);
            try {
                const url = API_URL ? `${API_URL}/movies/popular?page=1&pageSize=100` : `/api/movies/popular?page=1&pageSize=100`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const items = Array.isArray(data) ? data : (data && (data.items || data.results || data.movies || data.data)) || [];
                if (!mounted) return;
                setPopular(items);
            } catch (err) {
                console.warn('Failed to load popular movies', err);
                if (!mounted) return;
                setError('Could not load top picks');
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        getPopular();
        return () => { mounted = false; };
    }, []);

    // MoviePoster inner component
    function MoviePoster({ movie, className = '', style = {}, alt }) {
        const [fetchedPoster2, setFetchedPoster2] = useState(null);
        const primary = movie?.poster || null;
        const secondary = null;
        const idKey = movie?.titleid || null;

        useEffect(() => {
            let mounted = true;
            const fetchPicture = async () => {
                try {
                    const second = await getPosterPicture(movie?.title || '');
                    if (!mounted) return;
                    if (second) setFetchedPoster2('https://image.tmdb.org/t/p/w600_and_h900_face/' + second);
                } catch (err) {
                    // ignore
                }
            };
            if (movie?.title) fetchPicture();
            return () => { mounted = false; };
        }, [movie?.title]);

        const { currentSrc, handleError } = useMoviePoster(primary, fetchedPoster2 || secondary, idKey);
        return (
            <img
                src={currentSrc}
                alt={alt || (movie?.title || 'poster')}
                className={className}
                style={style}
                onError={handleError}
            />
        );
    }

    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil((popular.length || 0) / pageSize));
    useEffect(() => setPage(1), [popular, pageSize]);

    const pageItems = popular.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="list-container">
            {loading && <div>Loading...</div>}
            {error && <div className="text-danger">{error}</div>}

            {!loading && !error && (
                <>
                    {/* Top Picks */}
                    <section style={{ marginBottom: 28 }}>
                        <div className="d-flex align-items-center mb-3">
                            <h4 className="text-warning fw-bold m-0">{title}</h4>
                        </div>
                        <div className="items-grid">
                            {pageItems.map((m) => {
                                const titleText = m?.title || m?.Title || 'Untitled';
                                const rating = m?.averageRating ?? m?.rating ?? '';
                                return (
                                    <Link key={m.id || m._id || titleText} to={`/title/${m.id || m._id || ''}`} className="item-card">
                                        <MoviePoster movie={m} className="item-img w-100 rounded-1" style={{ cursor: 'pointer' }} alt={titleText} />
                                        <div className="item-body">
                                            <div className="item-title">{titleText}</div>
                                            <div className="item-sub">
                                                {rating ? (
                                                    <div className="d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                                        <span className="text-white">{rating}</span>
                                                    </div>
                                                ) : ''}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <Pagination page={page} onChange={setPage} hasNext={page < totalPages} totalPages={totalPages} />
                    </section>
                </>
            )}
        </div>
    );
}