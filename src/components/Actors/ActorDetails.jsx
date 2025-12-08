import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const FALLBACK_POSTER = 'https://cataas.com/cat';

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [coplayers, setCoplayers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/actors/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setActor(data);

        // Fetch co-players using the actor's name (firstname + lastname)
        const firstName = data.firstname || '';
        const lastName = data.lastname || '';
        const actorName = data.name || `${firstName} ${lastName}`.trim();
        
        if (actorName) {
          try {
            const cpRes = await fetch(`/api/actors/${encodeURIComponent(actorName)}/coplayers`);
            if (cpRes.ok) {
              const cpData = await cpRes.json();
              setCoplayers(Array.isArray(cpData) ? cpData : []);
            } else {
              console.warn(`Co-players endpoint returned ${cpRes.status} for name: ${actorName}`);
            }
          } catch (cpErr) {
            console.warn('Failed to load co-players:', cpErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load actor');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return (
    <>
      <div className="list-container">Loading…</div>
    </>
  );
  if (error) return (
    <>
      <div className="list-container">Error: {error}</div>
    </>
  );

  const photo = actor.photo || actor.headshot || FALLBACK_POSTER;

  const fullName = `${actor.firstname || ''} ${actor.lastname || ''}`.trim();

  return (
    <>
        <div className="title-container">
            <div className="title-grid">
                {/* Poster left */}
                <aside className="poster-card">
                    <img src={photo} alt={fullName || actor.name} className="poster-img" onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                </aside>

                {/* Content right */}
                <main className="title-main">
                    <h1 style={{marginTop:0, marginBottom:8}}>{fullName || actor.name || actor.personId}</h1>
                    <div className="details" style={{marginTop:0}}>
                    {actor.birthdate && <div>Born: {actor.birthdate}</div>}
                    {actor.deathdate && <div>Died: {actor.deathdate}</div>}
                    </div>

                    <section className="overview" style={{marginTop:12}}>
                    <p>{actor.biography || actor.bio || 'No biography available.'}</p>
                    </section>

                    {actor.known_for && actor.known_for.length > 0 && (
                    <section style={{marginTop:16}}>
                        <h4>Known For</h4>
                        <div className="items-grid">
                        {actor.known_for.map((kf) => {
                            const poster = kf.poster || FALLBACK_POSTER;
                            return (
                            <Link key={kf.id} to={`/title/${kf.id}`} className="text-decoration-none">
                                <div className="item-card">
                                <img src={poster} className="item-img" alt={kf.title} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                                <div className="item-body">
                                    <h6 className="item-title">{kf.title}</h6>
                                </div>
                                </div>
                            </Link>
                            );
                        })}
                        </div>
                    </section>
                    )}
                </main>
            </div>
        </div>

        <div className="title-container">
                {coplayers.length > 0 && (
                <section style={{marginTop:16}}>
                <h4>Co-Players</h4>
                <div className="items-grid">
                    {coplayers.map((cp) => {
                    const name = cp.fullname || cp.name || `${cp.firstname || ''} ${cp.lastname || ''}`.trim();
                    const pid = cp.personId;
                    const card = (
                        <div className="item-card">
                        <img src={cp.photo || FALLBACK_POSTER} className="item-img" alt={name} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                        <div className="item-body">
                            <h6 className="item-title">{name}</h6>
                            {cp.frequency && <p className="item-sub">Appeared together {cp.frequency} time(s)</p>}
                        </div>
                        </div>
                    );
                    return pid ? (
                        <Link key={pid} to={`/actor/${pid}`} className="text-decoration-none">{card}</Link>
                    ) : (
                        <div key={pid || name}>{card}</div>
                    );
                    })}
                </div>
                </section>
            )}
        </div>
    </>
  );
}

export default ActorDetails;


  