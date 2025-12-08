import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';

const FALLBACK_POSTER = 'https://cataas.com/cat';

// Small poster component that mirrors TopPickItem's poster behavior
function Poster({ src, title, className }) {
  const [imageError, setImageError] = useState(false);
  const isMissing = !src || imageError;
  return (
    <img
      src={isMissing ? FALLBACK_POSTER : src}
      alt={title}
      className={(className ? className + ' ' : '') + 'w-100 rounded-1'}
      style={{ height: '270px', objectFit: 'cover', cursor: 'pointer' }}
      onError={() => setImageError(true)}
    />
  );
}

function TitlesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use Vite proxy: request relative /api path
        const res = await fetch(`/api/movies?page=${page}&pageSize=${pageSize}`);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();

        // Handle different response shapes: array or object with items/results
        let items = [];

        if (Array.isArray(data)) {
          items = data;
        } else if (data) {
          items = data.items || data.results || data.data || [];
        }

        setMovies(items || []);
        setHasNext(Array.isArray(items) ? items.length >= pageSize : false);
      } catch (err) {
        console.error('Error fetching movies list:', err);
        setError('Could not load movies list from API.');
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [page]);

  return (
    <>
      
      <div className="list-container">
        <h3 style={{marginBottom:12}}>Titles</h3>

        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <div className="items-grid">
            {movies.map((m) => {
              const titleText = m?.title || m?.Title || 'Untitled';
              const rating = m?.averageRating ?? m?.rating ?? m?.AverageRating ?? m?.Rating;
              const votes = m?.numVotes ?? m?.numberOfVotes ?? m?.numvotes ?? m?.NumVotes;
              const sub = m?.date
                ? m.date
                : (rating != null || votes != null)
                  ? `${rating != null ? (typeof rating === 'number' && rating.toFixed ? rating.toFixed(1) : rating) : '—'} ★${votes != null ? ` • ${votes.toLocaleString()}` : ''}`
                  : '';

              return (
                <Link key={m.id} to={`/title/${m.id}`} className="item-card">
                  <Poster src={m?.poster || m?.Poster} title={titleText} className="item-img" />
                  <div className="item-body">
                    <div className="item-title">{titleText}</div>
                    <div className="item-sub">{sub}</div>
                  </div>
                </Link>
              );
            })}
            </div>

            <Pagination page={page} onChange={(p) => setPage(p)} hasNext={hasNext} />
          </>
        )}
      </div>
    </>
  );
}

export default TitlesList;  