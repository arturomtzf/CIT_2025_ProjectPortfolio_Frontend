import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMoviePoster } from '../../hooks/useMoviePoster';
import RatingForm from './RatingForm';
import { getProfilePicture, getPosterPicture } from '../../utils/picturesHelper';


function TitleDetails() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTitle(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load title');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Hook to manage the main poster with guarded fallbacks. pass title fields (may be undefined during load)
  const [fetchedPoster2, setFetchedPoster2] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPicture = async () => {
      try {
        const second = await getPosterPicture(title?.title || title?.originalTitle || '');
        if (!mounted) return;
        if (second) setFetchedPoster2(`https://image.tmdb.org/t/p/w600_and_h900_face/${second}`);
      } catch (err) {
        // ignore
      }
    };
    if (title && (title.title || title.originalTitle)) fetchPicture();
    return () => { mounted = false; };
  }, [title?.title, title?.originalTitle]);

  const { currentSrc: posterSrc, handleError: posterHandleError } = useMoviePoster(
    title?.poster || title?.posterUrl || title?.image || null,
    fetchedPoster2 || title?.poster2 || title?.backupPoster || null,
    title?.id || title?._id || id
  );

  // local component to render actor images using the same hook
  function ActorPoster({ actor, className = '', style = {}, alt }) {
    const primary = actor?.photo || actor?.headshot || null;
    const secondary = actor?.photo2 || actor?.backupPhoto || null;
    const key = actor?.personId || actor?.id || actor?.name || null;
    const { currentSrc, handleError } = useMoviePoster(primary, secondary, key);

    const [tmdbSrc, setTmdbSrc] = useState(null);

    useEffect(() => {
      let mounted = true;
      const load = async () => {
        // prefer personId when available (addProfilePicture uses personId earlier)
        const lookupKey = actor?.personId || actor?.id || actor?.name || null;
        if (!lookupKey) return;
        try {
          const path = await getProfilePicture(lookupKey);
          if (!mounted) return;
          if (path) setTmdbSrc(`https://image.tmdb.org/t/p/w300_and_h450_face${path}`);
        } catch (err) {
          
        }
      };
      load();
      return () => { mounted = false; };
    }, [actor?.personId, actor?.id, actor?.name]);

    const src = tmdbSrc || currentSrc;
    const onError = tmdbSrc ? () => setTmdbSrc(null) : handleError;

    return (
      <img src={src} alt={alt} className={className} style={style} onError={onError} />
    );
  }

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

  const poster = posterSrc;
  const release = title.releaseDate || title.startYear || title.year || '';
  const runtime = title.runtimeMinutes || title.runtime || null;
  const genres = (title.genre && typeof title.genre === 'string') ? title.genre.split(',').map(s=>s.trim()).filter(Boolean) : (title.genres || []);
  const plot = title.plot || title.overview || title.description || '';

  return (
    <>
      <div className="title-container">
          <div className="title-grid">

            <aside className="poster-card">
              <img src={posterSrc} alt={title.title} className="poster-img" onError={posterHandleError} />
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px'}}>
                <button type="button" onClick={() => setShowRatingForm(s => !s)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }} aria-label="Toggle rating form">
                  <span className="badge">{title.rating != null ? `${title.rating.toFixed(1)} ★` : '—'}</span>
                </button>
                <span className="badge">{title.numberOfVotes != null ? `${title.numberOfVotes.toLocaleString()} votes` : 'No votes'}</span>
              </div>

              <button
                    className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
                    style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3c3c3c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2c2c2c'}
                >
                    <i className="bi bi-plus-lg me-2"></i> Watchlist
                </button>

              {showRatingForm && (
                <div style={{ padding: 10 }}>
                  <RatingForm id={id} title={title} setTitle={setTitle} onClose={() => setShowRatingForm(false)} />
                </div>
              )}
            </aside>

            {/* Right: Content */}
            <main className="title-main">
                {/* Big title */}
                <h1 style={{marginTop:0, marginBottom:8}}>{title.title}</h1>
      
              <div className="details" style={{marginTop:0}}>
                {release && <div>{release}</div>}
                {runtime && <div>{runtime} min</div>}
                {title.type && <div>{title.type}</div>}
              </div>

              {genres && genres.length > 0 && (
                <div className="badges-wrap" style={{marginTop:12}}>
                  {genres.map((g) => (
                    <div key={g} className="badge">{g}</div>
                  ))}
                </div>
              )}

              {/* Overview */}
              <section className="overview" style={{marginTop:12}}>
                <p>{plot || 'No description available.'}</p>
              </section>

              
              {title.directors && title.directors.length > 0 && (
                <div style={{marginTop:16}}>
                  <span className="meta-small" style={{marginRight:8}}>Director</span>
                  {title.directors.map((d, i) => {
                    const name = d.name || `${d.firstname || ''} ${d.lastname || ''}`.trim();
                    const content = d.personId ? (
                      <Link key={d.personId} to={`/actor/${d.personId}`} style={{color:'#fff', textDecoration:'none'}}>{name}</Link>
                    ) : (
                      <span key={name + i}>{name}</span>
                    );
                    return (
                      <span key={(d.personId || name) + '_dir'}>
                        {content}{i < title.directors.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                </div>
              )}

              {title.writers && title.writers.length > 0 && (
                <div style={{marginTop:8}}>
                  <span className="meta-small" style={{marginRight:8}}>Writer</span>
                  {title.writers.map((w, i) => {
                    const name = w.name || `${w.firstname || ''} ${w.lastname || ''}`.trim();
                    const content = w.personId ? (
                      <Link key={w.personId} to={`/actor/${w.personId}`} style={{color:'#fff', textDecoration:'none'}}>{name}</Link>
                    ) : (
                      <span key={name + i}>{name}</span>
                    );
                    return (
                      <span key={(w.personId || name) + '_wri'}>
                        {content}{i < title.writers.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
      </div>

      <div className="title-container">
        <section style={{marginTop:18}}>
          <h4>Stars</h4>
          {title.actors && title.actors.length > 0 ? (
            <div className="items-grid">
              {title.actors.map((actor, idx) => {
                const isString = typeof actor === 'string';
                const actorName = isString ? actor : (actor.name || `${actor.firstname || ''} ${actor.lastname || ''}`.trim());
                const actorId = isString ? null : actor.personId;
                const card = (
                  <div className="item-card">
                    <ActorPoster actor={actor} className="item-img" style={{ height: '260px', objectFit: 'cover' }} alt={actorName} />
                    <div className="item-body">
                      <h6 className="item-title">{actorName}</h6>
                    </div>
                  </div>
                );
                return actorId ? (
                  <Link key={actorId} to={`/actor/${actorId}`} className="text-decoration-none">
                    {card}
                  </Link>
                ) : (
                  <div key={idx}>
                    {card}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No cast information.</p>
          )}
        </section>
      </div>
    </>
  );
}

export default TitleDetails;
