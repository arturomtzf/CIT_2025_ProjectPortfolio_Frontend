import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfilePicture } from '../../utils/picturesHelper';

const FALLBACK_POSTER = 'https://loremfaces.net/96/id/1.jpg';

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

  const [profilePicture, setProfilePicture] = useState(null);

  const [coplayerPics, setCoplayerPics] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchPic = async () => {
      if (!actor || !actor.personId) return;
      try {
        const pic = await getProfilePicture(actor.personId);
        if (!mounted) return;
        setProfilePicture(pic ? `https://image.tmdb.org/t/p/w300_and_h450_face${pic}` : null);
      } catch (err) {
        if (!mounted) return;
        console.warn('Failed to load profile picture', err);
        setProfilePicture(null);
      }
    };
    fetchPic();
    return () => { mounted = false; };
  }, [actor && actor.personId]);

  // Fetch co-player profile pictures in bulk and store keyed by personId
  useEffect(() => {
    let mounted = true;
    if (!coplayers || coplayers.length === 0) {
      setCoplayerPics({});
      return;
    }

    const fetchAll = async () => {
      try {
        const promises = coplayers.map(async (cp) => {
          const pid = cp?.personId;
          if (!pid) return [pid, null];
          try {
            const p = await getProfilePicture(pid);
            return [pid, p ? `https://image.tmdb.org/t/p/w300_and_h450_face${p}` : null];
          } catch (e) {
            return [pid, null];
          }
        });

        const entries = await Promise.all(promises);
        if (!mounted) return;
        const map = {};
        for (const [k, v] of entries) {
          if (k) map[k] = v;
        }
        setCoplayerPics(map);
      } catch (err) {
        if (!mounted) return;
        console.warn('Failed to fetch coplayer pictures', err);
        setCoplayerPics({});
      }
    };

    fetchAll();
    return () => { mounted = false; };
  }, [coplayers]);

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

  const photo = profilePicture || actor.photo || actor.headshot || FALLBACK_POSTER;

  const fullName = `${actor.firstname || ''} ${actor.lastname || ''}`.trim();

  // Presentational components
  const ProfessionList = ({ items = [] }) => {
    const list = (items || []).map(p => (p && (p.name || p.title || p))).filter(Boolean);
    if (!list || list.length === 0) return null;
    return (
      <div style={{marginTop:8}}>
        <strong className="text-white">Professions:</strong>{' '}
        {list.join(', ')}
      </div>
    );
  };

  const KnownForGrid = ({ items = [] }) => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{marginTop:16}}>
        <h4>Known For</h4>
        <div className="items-grid">
          {items.map((kf) => {
            const poster = kf.poster || FALLBACK_POSTER;
            const key = kf.id || kf._id || kf.title || poster;
            return (
              <Link key={key} to={`/title/${kf.id}`} className="text-decoration-none">
                <div className="item-card">
                  <img src={poster} className="item-img" alt={kf.title} onError={(e)=>{ if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER }} />
                  <div className="item-body"><h6 className="item-title">{kf.title}</h6></div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  };

  const FilmographyGrid = ({ items = [] }) => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{marginTop:16}}>
        <h4>Known For:</h4>
        <div className="items-grid">
          {items.map((t) => {
            const tid = t.id || t.titleId || t._id || null;
            const tTitle = t.title || t.name || t.Title || 'Untitled';
            const poster = t.poster || t.posterUrl || t.image || FALLBACK_POSTER;
            const key = tid || tTitle;
            const card = (
              <div key={key} className="item-card">
                <img src={poster} className="item-img" alt={tTitle} onError={(e)=>{ if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER }} />
                <div className="item-body"><h6 className="item-title">{tTitle}</h6></div>
              </div>
            );
            return tid ? (
              <Link key={key} to={`/title/${tid}`} className="text-decoration-none">{card}</Link>
            ) : card;
          })}
        </div>
      </section>
    );
  };

  const CoPlayersGrid = ({ items = [], pics = {} }) => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{marginTop:16}}>
        <h4>Co-Players</h4>
        <div className="items-grid">
          {items.map((cp) => {
            const name = cp.fullname || cp.name || `${cp.firstname || ''} ${cp.lastname || ''}`.trim();
            const pid = cp.personId;
            const cpPic = pid ? (pics[pid] || null) : null;
            const src = cpPic || cp.photo || FALLBACK_POSTER;
            const card = (
              <div className="item-card">
                <img src={src} className="item-img" alt={name} onError={(e)=>{ if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER }} />
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
    );
  };

  return (
    <>
        <div className="title-container">
            <div className="title-grid">
                {/* Poster left */}
                <aside className="poster-card">
                    <img src={photo} alt={fullName || actor.name} className="poster-img" onError={(e)=>{ if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER }} />
                </aside>

                {/* Content right */}
                <main className="title-main">
                    <h1 style={{marginTop:0, marginBottom:8}}>{fullName || actor.name || actor.personId}</h1>
                    <div className="details" style={{marginTop:0}}>
                      {/* Birth / Death */}
                      {actor.birthdate && <div>Born: {actor.birthdate}</div>}
                      {actor.deathdate && <div>Died: {actor.deathdate}</div>}

                      {/* Rating summary */}
                      {(actor.averagerating || actor.Averagerating || actor.numvotes || actor.Numvotes) && (
                        <div style={{marginTop:6}}>
                          <span className="me-3 d-inline-flex align-items-center">
                            <i className="bi bi-star-fill text-warning me-1" />
                            <strong className="text-white">{(actor.averagerating ?? actor.Averagerating) || '—'}</strong>
                          </span>
                          <span className="text-secondary">{(actor.numvotes ?? actor.Numvotes) ? `${actor.numvotes ?? actor.Numvotes} votes` : ''}</span>
                        </div>
                      )}

                      {/* Professions */}
                      <ProfessionList items={((actor.professions && actor.professions.length) ? actor.professions : actor.Professions)} />
                    </div>

                    <section className="overview" style={{marginTop:12}}>
                    <p>{actor.biography || actor.bio || 'No biography available.'}</p>
                    </section>

                    <KnownForGrid items={actor.known_for} />

                    {/* Titles / Filmography */}
                    <FilmographyGrid items={((actor.titles && actor.titles.length) ? actor.titles : actor.Titles)} />
                </main>
            </div>
        </div>

        <div className="title-container">
          <CoPlayersGrid items={coplayers} pics={coplayerPics} />
        </div>
    </>
  );
}

export default ActorDetails;


  