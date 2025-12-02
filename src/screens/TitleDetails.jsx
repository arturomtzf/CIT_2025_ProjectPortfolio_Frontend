// src/screens/Title.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainHeader from '../components/MainHeader/MainHeader';

const FALLBACK_POSTER = 'https://cataas.com/cat';


function TitleDetails() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
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

  if (loading) return (
    <>
      <MainHeader />
      <div className="title-container">Loading…</div>
    </>
  );
  if (error) return (
    <>
      <MainHeader />
      <div className="title-container">Error: {error}</div>
    </>
  );

  const poster = title.poster || title.posterUrl || FALLBACK_POSTER;
  const release = title.releaseDate || title.startYear || title.year || '';
  const runtime = title.runtimeMinutes || title.runtime || null;
  const genres = (title.genre && typeof title.genre === 'string') ? title.genre.split(',').map(s=>s.trim()).filter(Boolean) : (title.genres || []);
  const plot = title.plot || title.overview || title.description || '';

  return (
    <>
      <MainHeader />
      <div className="title-container">
        <div className="title-grid">
          <aside className="poster-card">
            <img src={poster} alt={title.title} className="poster-img" onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
            <div className="poster-body">
              <h2 className="title-row">{title.title}</h2>

              <div style={{marginTop:12}}>
                <div className="meta-small"><strong>Release:</strong> {release}</div>
                {runtime && <div className="meta-small"><strong>Runtime:</strong> {runtime} min</div>}
                {title.type && <div className="meta-small"><strong>Type:</strong> {title.type}</div>}
              </div>

              <div style={{marginTop:12}}>
                <div style={{fontWeight:700, fontSize:18}}>{title.rating != null ? title.rating.toFixed(1) : '—'}</div>
                <div className="meta-small">{title.numberOfVotes != null ? `${title.numberOfVotes.toLocaleString()} votes` : 'No votes'}</div>
              </div>
            </div>
          </aside>

          <main className="title-main">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <h3 style={{marginTop:0}}>{title.title} <small className="meta-small">{release}</small></h3>
            </div>

            {genres && genres.length > 0 && (
              <div className="badges-wrap">
                {genres.map((g) => (
                  <div key={g} className="badge">{g}</div>
                ))}
              </div>
            )}

            {title.directors && title.directors.length > 0 && (
              <div style={{marginTop:8}} className="meta-small">
                <strong>Directors:</strong>{' '}
                {title.directors.map((d, i) => {
                  const name = d.name || `${d.firstname || ''} ${d.lastname || ''}`.trim();
                  return d.personId ? (
                    <span key={d.personId}>
                      <Link to={`/actor/${d.personId}`} style={{color:'#fff', textDecoration:'none'}}>{name}</Link>
                      {i < title.directors.length - 1 ? ', ' : ''}
                    </span>
                  ) : (
                    <span key={name + i}>{name}{i < title.directors.length - 1 ? ', ' : ''}</span>
                  );
                })}
              </div>
            )}
            {title.writers && title.writers.length > 0 && (
              <div style={{marginTop:4}} className="meta-small">
                <strong>Writers:</strong>{' '}
                {title.writers.map((w, i) => {
                  const name = w.name || `${w.firstname || ''} ${w.lastname || ''}`.trim();
                  return w.personId ? (
                    <span key={w.personId}>
                      <Link to={`/actor/${w.personId}`} style={{color:'#fff', textDecoration:'none'}}>{name}</Link>
                      {i < title.writers.length - 1 ? ', ' : ''}
                    </span>
                  ) : (
                    <span key={name + i}>{name}{i < title.writers.length - 1 ? ', ' : ''}</span>
                  );
                })}
              </div>
            )}

            <section className="overview">
              <h4>Overview</h4>
              <p>{plot || 'No description available.'}</p>
            </section>

            <section className="details">
              <div><strong>Type:</strong> {title.type || '—'}</div>
              <div><strong>Runtime:</strong> {runtime ? `${runtime} min` : '—'}</div>
              <div><strong>Adult:</strong> {title.isAdult ? 'Yes' : 'No'}</div>
            </section>

            <section style={{marginTop:18}}>
              <h4>Cast</h4>
              {title.actors && title.actors.length > 0 ? (
                <ul className="cast-list">
                  {title.actors.map((actor, idx) => {
                    const isString = typeof actor === 'string';
                    const actorName = isString ? actor : (actor.name || `${actor.firstname || ''} ${actor.lastname || ''}`.trim());
                    const actorId = isString ? null : actor.personId;
                    
                    return (
                      <li key={actorId || idx} className="cast-item">
                        {actorId ? (
                          <Link to={`/actor/${actorId}`} style={{color:'#fff', textDecoration:'none'}}>
                            {actorName}
                          </Link>
                        ) : (
                          <span>{actorName}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No cast information.</p>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default TitleDetails;
