// Actor details page — uses index.css classes and actor endpoint
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainHeader from '../components/MainHeader/MainHeader';

const FALLBACK_POSTER = 'https://cataas.com/cat';

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
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
      <MainHeader />
      <div className="list-container">Loading…</div>
    </>
  );
  if (error) return (
    <>
      <MainHeader />
      <div className="list-container">Error: {error}</div>
    </>
  );

  const photo = actor.photo || actor.headshot || FALLBACK_POSTER;

  const fullName = `${actor.firstname || ''} ${actor.lastname || ''}`.trim();

  return (
    <>
      <MainHeader />
      <div className="list-container">
        <div className="actor-hero">
          <img src={photo} alt={fullName || actor.name} className="actor-photo" onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />

          <div className="actor-bio">
            <h2 style={{marginTop:0}}>{fullName || actor.name || actor.personId}</h2>
            {actor.birthdate && <div className="meta-small">Born: {actor.birthdate}</div>}
            {actor.deathdate && <div className="meta-small">Died: {actor.deathdate}</div>}
            {actor.averagerating && <div className="meta-small">Rating: {actor.averagerating}</div>}
            {actor.numvotes && <div className="meta-small">Votes: {actor.numvotes}</div>}

            <section style={{marginTop:12}}>
              <h4>Biography</h4>
              <p>{actor.biography || actor.bio || 'No biography available.'}</p>
            </section>

            {actor.known_for && actor.known_for.length > 0 && (
              <section style={{marginTop:12}}>
                <h4>Known For</h4>
                <div className="items-grid">
                  {actor.known_for.map((kf) => (
                    <Link key={kf.id} to={`/title/${kf.id}`} className="text-decoration-none">
                      <div className="item-card">
                        <img src={kf.poster || FALLBACK_POSTER} className="item-img" alt={kf.title} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                        <div className="item-body">
                          <h6 className="item-title">{kf.title}</h6>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActorDetails;
