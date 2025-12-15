import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { useMoviePoster } from '../../hooks/useMoviePoster';
import { getPosterPicture } from '../../utils/picturesHelper';
const API_URL = import.meta.env.VITE_API_URL;

function TitlesList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 1000;


    // pagination state for each section
    const [highestPage, setHighestPage] = useState(1);
    const [azPage, setAzPage] = useState(1);

    // page sizes specific to sections
    const AZ_PAGE_SIZE = 24;

    useEffect(() => {
      const getMovies = async () => {
        setLoading(true);
        setError(null);
        try {
          const url = API_URL
            ? `${API_URL}/movies?page=1&pageSize=${pageSize}`
            : `/api/movies?page=1&pageSize=${pageSize}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch movies');
          const data = await res.json();

          let items = [];
          if (Array.isArray(data)) items = data;
          else if (data) items = data.items || data.results || data.data || data.movies || [];

          setMovies(items || []);
        } catch (err) {
          console.error('Error fetching movies list:', err);
          setError('Could not load movies list from API.');
        } finally {
          setLoading(false);
        }
      };

      getMovies();

    
  }, []);

  // reset section pages when movies change
  useEffect(() => {
    setHighestPage(1);
    setAzPage(1);
  }, [movies]);

  // prepare section lists
  const azList = (movies || []).slice().sort((a, b) => {
    const ta = (a?.title || a?.Title || '').toString().toLowerCase();
    const tb = (b?.title || b?.Title || '').toString().toLowerCase();
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });
  const azTotalPages = Math.max(1, Math.ceil((azList.length || 0) / AZ_PAGE_SIZE));
  const azPageItems = azList.slice((azPage - 1) * AZ_PAGE_SIZE, azPage * AZ_PAGE_SIZE);

  // Component to render the poster for a movie item.
  function MoviePoster({ movie, className = '', style = {}, alt }) {
    const [fetchedPoster2, setFetchedPoster2] = useState(null);
    const primary = movie?.poster || movie?.Poster || movie?.posterUrl || movie?.image || null;
    const secondary = movie?.poster2 || movie?.backupPoster || null;
    const idKey = movie?.id || movie?._id || movie?.movieId || null;

    useEffect(() => {
      let mounted = true;
      const fetchPicture = async () => {
        try {
          const second = await getPosterPicture(movie?.title || movie?.Title || '');
          if (!mounted) return;
          if (second) setFetchedPoster2('https://image.tmdb.org/t/p/w600_and_h900_face/' + second);
        } catch (err) {
          // ignore
        }
      };
      fetchPicture();
      return () => { mounted = false; };
    }, [movie?.title, movie?.Title]);

    const { currentSrc, handleError } = useMoviePoster(primary, fetchedPoster2 || secondary, idKey);
    return (
      <img
        src={currentSrc}
        alt={alt || (movie?.title || movie?.Title || 'poster')}
        className={className}
        style={style}
        onError={handleError}
      />
    );
  }

  // Small components for rendering lists
  function MovieCard({ m }) {
    const titleText = m?.title || m?.Title || 'Untitled';
    const rating = m?.averageRating ?? m?.rating ?? '';
    const id = m?.id || m?._id || m?.movieId || titleText;
    return (
      <Link key={id} to={`/title/${id}`} className="item-card">
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
  }

  function AZGrid({ items = [] }) {
    if (!items || items.length === 0) return null;
    return (
      <>
        <div className="items-grid">
          {items.map((it) => (
            <MovieCard key={it?.id || it?._id || it?.movieId || (it?.title || it?.Title)} m={it} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="list-container">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            {/* A - Z */}
            <section style={{ marginBottom: 28 }}>
              <div className="d-flex align-items-center mb-3">
                <h4 className="text-warning fw-bold m-0">A — Z</h4>
              </div>
              <AZGrid items={azPageItems} />
              <Pagination page={azPage} onChange={setAzPage} hasNext={azPage < azTotalPages} totalPages={azTotalPages} />
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default TitlesList;  