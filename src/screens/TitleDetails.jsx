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

  return (
    <>
      <MainHeader />
      <div className="title-container">
        <div className="title-grid">
          <aside className="poster-card">
            <img src={poster} alt={title.title} className="poster-img" onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
            <div className="poster-body">

              <div style={{marginTop:12}}>
                <div className="meta-small"><strong>Release:</strong> {release}</div>
                {runtime && <div className="meta-small"><strong>Runtime:</strong> {runtime} min</div>}
              </div>

              <div style={{marginTop:12}}>
                <div style={{fontWeight:700, fontSize:18}}>{title.averageRating != null ? title.averageRating.toFixed(1) : '—'}</div>
                <div className="meta-small">{title.numVotes != null ? `${title.numVotes.toLocaleString()} votes` : 'No votes'}</div>
              </div>
            </div>
          </aside>

          <main className="title-main">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <h3 style={{marginTop:0}}>{title.title} <small className="meta-small">{release}</small></h3>
            </div>

            {title.genres && title.genres.length > 0 && (
              <div className="badges-wrap">
                {title.genres.map((g) => (
                  <div key={g} className="badge">{g}</div>
                ))}
              </div>
            )}

            <section className="overview">
              <h4>Overview</h4>
              <p>{title.description || 'No description available.'}</p>
            </section>

            <section className="details">
              <div><strong>Country:</strong> {title.country || title.countries?.join(', ') || '—'}</div>
              <div><strong>Language:</strong> {title.language || title.languages?.join(', ') || '—'}</div>
              <div><strong>Budget:</strong> {title.budget || '—'}</div>
            </section>

            <section style={{marginTop:18}}>
              <h4>Cast</h4>
              {title.cast && title.cast.length > 0 ? (
                <ul className="cast-list">
                  {title.cast.map((c) => (
                    <li key={(c.personId || c.id) + (c.role || '')} className="cast-item">
                      {c.personId ? (
                        <Link to={`/actor/${c.personId}`} style={{color:'#fff', textDecoration:'none'}}>{c.name}</Link>
                      ) : (
                        <span>{c.name}</span>
                      )}
                      {c.role && <span style={{color:'rgba(255,255,255,0.75)'}}> — {c.role}</span>}
                      {c.characters && <div style={{color:'rgba(255,255,255,0.75)'}}>as {c.characters}</div>}
                    </li>
                  ))}
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
