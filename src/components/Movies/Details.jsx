import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMoviePoster } from '../../hooks/useMoviePoster';
import { getPosterPicture } from '../../utils/picturesHelper';
import { getTitleById } from '../../utils/titlesService';
import { GenreBadges, DirectorList, WriterList, StarsGrid } from './TitleDetailsItems';
import { handleBookmarkMovies } from "../../utils/bookmarkHelper";
import RatingModal from "../Rating/RatingModal";
import WatchlistButton from './WatchlistButton';

function TitleDetails() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTitleById(id);
      setTitle(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load title');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    const res = handleBookmarkMovies(id, isBookmarked);
    if (res) setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    load();
  }, [id]);

  // Hook to manage the main poster with guarded fallbacks.
  const [fetchedPoster2, setFetchedPoster2] = useState(null);

  useEffect(() => {
    const fetchPicture = async () => {
      if (!title || !title.title) return;
      try {
        const second = await getPosterPicture(title.title);
        if (second) setFetchedPoster2(`https://image.tmdb.org/t/p/w600_and_h900_face/${second}`);
      } catch (err) {
        // ignore
      }
    };

    fetchPicture();
  }, [title?.title]);

  const { currentSrc: posterSrc, handleError: posterHandleError } = useMoviePoster(
    title?.poster || null,
    fetchedPoster2 || null,
    title?.titleid || id
  );

  if (loading) return (
    <>
      <div className="title-container">Loading…</div>
    </>
  );
  if (error) return (
    <>
      <div className="title-container">Error: {error}</div>
    </>
  );

  const release = title.releaseDate || title.startYear || title.year || '';
  const runtime = title.runtimeMinutes || title.runtime || null;
  const genres = (title.genre && typeof title.genre === 'string') ? title.genre.split(',').map(s => s.trim()).filter(Boolean) : (title.genres || []);
  const plot = title.plot || title.overview || title.description || '';

  return (
    <div className="title-details-page" style={{ position: 'relative', minHeight: '100vh' }}>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="title-container" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: posterSrc ? `url(${posterSrc})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(20px) brightness(0.35)',
              transform: 'scale(1.03)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          <div className="title-grid" style={{ position: 'relative', zIndex: 1 }}>

            <aside className="poster-card">
              <img src={posterSrc} alt={title.title} className="poster-img" onError={posterHandleError} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <span className="badge">{title.rating != null ? `${title.rating.toFixed(1)} ★` : '—'}</span>
                <span className="badge">{title.numberOfVotes != null ? `${title.numberOfVotes.toLocaleString()} votes` : 'No votes'}</span>
              </div>
              <button
                className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
                style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem', marginBottom: '10px' }}
                onClick={handleBookmark}
              >
                {isBookmarked ? <i className="bi bi-check-lg me-2" /> : <i className="bi bi-plus-lg me-2" />}
                Watchlist
              </button>
              <button
                className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
                style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem' }}
                onClick={() => setShowRatingModal(true)}
              >
                <i className="bi bi-star-fill me-2" /> Rate
              </button>

            </aside>

            {/* Right: Content */}
            <main className="title-main">
              {/* Big title */}
              <h1 style={{ marginTop: 0, marginBottom: 8 }}>{title.title}</h1>

              <div className="details" style={{ marginTop: 0 }}>
                {release && <div>{release}</div>}
                {runtime && <div>{runtime} min</div>}
                {title.type && <div>{title.type}</div>}
              </div>

              <GenreBadges items={genres} />

              {/* Overview */}
              <section className="overview" style={{ marginTop: 12 }}>
                <p>{plot || 'No description available.'}</p>
              </section>


              <DirectorList directors={title.directors} />

              <WriterList writers={title.writers} />
            </main>
          </div>
        </div>

        <div className="title-container">
          <section style={{ marginTop: 18 }}>
            <h4>Stars</h4>
            <StarsGrid actors={title.actors} />
          </section>
        </div>
      </div>
      <RatingModal
        show={showRatingModal}
        handleClose={() => setShowRatingModal(false)}
        titleid={id}
        load={load}
      />
    </div>
  );
}

export default TitleDetails;
