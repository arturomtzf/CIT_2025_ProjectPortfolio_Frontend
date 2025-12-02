import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader.jsx';

const FALLBACK_POSTER = 'https://cataas.com/cat';

export default function TitlesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use Vite proxy: request relative /api path
        const res = await fetch(`/api/movies?page=1&pageSize=24`);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data || []);
      } catch (err) {
        console.error('Error fetching movies list:', err);
        setError('Could not load movies list from API.');
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  return (
    <>
      <MainHeader />
      <div className="container py-5 text-white">
        <h3 className="mb-4">Titles</h3>

        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {movies.map((m) => (
              <div key={m.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <Link to={`/title/${m.id}`} className="text-decoration-none text-white">
                  <div className="card bg-dark text-white h-100">
                    <img src={m.poster || FALLBACK_POSTER} className="card-img-top" alt={m.title} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                    <div className="card-body py-2">
                      <h6 className="card-title text-truncate m-0">{m.title}</h6>
                      <small className="text-secondary">{m.averageRating ? `${m.averageRating} ★` : ''}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
