import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';

const FALLBACK_POSTER = 'https://picsum.dev//300/200';

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
  // fetch a large set (increase if your API supports more) and compute sections client-side
  // set high so pages can be as many as possible; adjust if your API limits response size
  const pageSize = 1000;

  // pagination state for each section
  const [highestPage, setHighestPage] = useState(1);
  const [azPage, setAzPage] = useState(1);

  // page sizes specific to sections
  const HIGHEST_PAGE_SIZE = 8;
  const AZ_PAGE_SIZE = 24;

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/movies?page=1&pageSize=${pageSize}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();

        let items = [];
        if (Array.isArray(data)) items = data;
        else if (data) items = data.items || data.results || data.data || data.movies || [];

        setMovies(items || []);
        // (no genre processing — we only need movies for the sections)
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
  const highestList = (movies || []).slice().sort((a, b) => (b?.averageRating ?? b?.rating ?? 0) - (a?.averageRating ?? a?.rating ?? 0));
  const highestTotalPages = Math.max(1, Math.ceil((highestList.length || 0) / HIGHEST_PAGE_SIZE));
  const highestPageItems = highestList.slice((highestPage - 1) * HIGHEST_PAGE_SIZE, highestPage * HIGHEST_PAGE_SIZE);

  const azList = (movies || []).slice().sort((a, b) => {
    const ta = (a?.title || a?.Title || '').toString().toLowerCase();
    const tb = (b?.title || b?.Title || '').toString().toLowerCase();
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });
  const azTotalPages = Math.max(1, Math.ceil((azList.length || 0) / AZ_PAGE_SIZE));
  const azPageItems = azList.slice((azPage - 1) * AZ_PAGE_SIZE, azPage * AZ_PAGE_SIZE);

  // (removed randomized-genre section and related state)

  return (
    <>
      
      <div className="list-container">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            {/* Highest Rated */}
            <section style={{ marginBottom: 28 }}>
              <div className="d-flex align-items-center mb-3">
                <h4 className="text-warning fw-bold m-0">Highest Rated</h4>
              </div>
              <div className="items-grid">
                {movies
                  .slice()
                  .sort((a, b) => (b?.averageRating ?? b?.rating ?? 0) - (a?.averageRating ?? a?.rating ?? 0))
                  .slice(0, 8)
                  .map((m) => {
                    const titleText = m?.title || m?.Title || 'Untitled';
                    const sub = m?.averageRating ? `${m.averageRating} ★` : '';
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
            </section>

            {/* A - Z */}
            <section style={{ marginBottom: 28 }}>
              <div className="d-flex align-items-center mb-3">
                <h4 className="text-warning fw-bold m-0">A — Z</h4>
              </div>
              <div className="items-grid">
                {azPageItems.map((m) => {
                    const titleText = m?.title || m?.Title || 'Untitled';
                    const rating = m?.averageRating ?? m?.rating ?? '';
                    return (
                      <Link key={m.id} to={`/title/${m.id}`} className="item-card">
                        <Poster src={m?.poster || m?.Poster} title={titleText} className="item-img" />
                        <div className="item-body">
                          <div className="item-title">{titleText}</div>
                          <div className="item-sub">{rating ? `${rating} ★` : ''}</div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-sm btn-outline-light me-2" onClick={() => setAzPage(p => Math.max(1, p - 1))}>Prev</button>
                <div className="text-secondary align-self-center">Page {azPage} / {azTotalPages}</div>
                <button className="btn btn-sm btn-outline-light ms-2" onClick={() => setAzPage(p => Math.min(azTotalPages, p + 1))}>Next</button>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default TitlesList;  