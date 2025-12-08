import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
      <div className="title-container">Loading…</div>
    </>
  );
  if (error) return (
    <>
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
      <div className="title-container">
        <div className="title-container">
          <div className="title-grid">
            {/* Left: Poster with rating/votes below */}
            <aside className="poster-card">
              <img src={poster} alt={title.title} className="poster-img" onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px'}}>
                <span className="badge">{title.rating != null ? `${title.rating.toFixed(1)} ★` : '—'}</span>
                <span className="badge">{title.numberOfVotes != null ? `${title.numberOfVotes.toLocaleString()} votes` : 'No votes'}</span>
              </div>
            </aside>

            {/* Right: Content */}
            <main className="title-main">
                {/* Big title */}
                <h1 style={{marginTop:0, marginBottom:8}}>{title.title}</h1>
            
              {/* Meta row */}
              <div className="details" style={{marginTop:0}}>
                {release && <div>{release}</div>}
                {runtime && <div>{runtime} min</div>}
                {title.type && <div>{title.type}</div>}
              </div>

              {/* Genres as badges */}
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

              {/* People rows like IMDb */}
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
      </div>

      <div className="title-container">
        {/* Cast grid as cards */}
        <section style={{marginTop:18}}>
          <h4>Stars</h4>
          {title.actors && title.actors.length > 0 ? (
            <div className="items-grid">
              {title.actors.map((actor, idx) => {
                const isString = typeof actor === 'string';
                const actorName = isString ? actor : (actor.name || `${actor.firstname || ''} ${actor.lastname || ''}`.trim());
                const actorId = isString ? null : actor.personId;
                const imgSrc = (actor && actor.photo) ? actor.photo : FALLBACK_POSTER;
                const card = (
                  <div className="item-card">
                    <img src={imgSrc} className="item-img" alt={actorName} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
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
