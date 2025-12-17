import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfilePicture } from '../../utils/picturesHelper';
import KnownForGrid from './KnownForGrid';
import CoPlayersGrid from './CoPlayersGrid';
import Pagination from '../Pagination/Pagination';
import ProfessionList from './ProfessionListItem';
import { handleBookmarkActors } from "../../utils/bookmarkActorsHelper";

const FALLBACK_POSTER = 'https://loremfaces.net/96/id/1.jpg';

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [coplayers, setCoplayers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cpPage, setCpPage] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const CP_PAGE_SIZE = 12;

   const handleBookmark = () => {
      const res = handleBookmarkActors(id, isBookmarked);
  
      setIsBookmarked(res ? !isBookmarked : isBookmarked);
    }
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
    const fetchProfilePic = async () => {
      if (!actor || !actor.personId) return;
      try {
        const pic = await getProfilePicture(actor.personId);
        setProfilePicture(pic ? `https://image.tmdb.org/t/p/w300_and_h450_face${pic}` : null);
      } catch (err) {
        console.warn('Failed to load profile picture', err);
        setProfilePicture(null);
      }
    };

    const fetchCoplayerPics = async () => {
      if (!coplayers || coplayers.length === 0) {
        setCoplayerPics({});
        return;
      }
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
        const map = {};
        for (const [k, v] of entries) {
          if (k) map[k] = v;
        }
        setCoplayerPics(map);
      } catch (err) {
        console.warn('Failed to fetch coplayer pictures', err);
        setCoplayerPics({});
      }
    };

    fetchProfilePic();
    fetchCoplayerPics();
    setCpPage(1);
  }, [actor?.personId, coplayers]);

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

  const photo = profilePicture || actor.photo || actor.headshot || 'https://loremfaces.net/96/id/1.jpg';

  const fullName = `${actor.firstname || ''} ${actor.lastname || ''}`.trim();

  const knownForItems = (actor && Array.isArray(actor.known_for) && actor.known_for.length)
    ? actor.known_for
    : (actor && Array.isArray(actor.titles) && actor.titles.length ? actor.titles : []);

  return (
    <>
      <div className="title-container">
        <div className="title-grid">
          {/* Poster left */}
          <aside className="poster-card">
            <img
              src={photo}
              alt={fullName || actor.name}
              className="poster-img"
            />

            <button
                className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
                style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem', marginBottom: '10px' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3c3c3c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2c2c2c'}
                onClick={handleBookmark}
              >
              {isBookmarked ? <i className="bi bi-check-lg me-2" /> : <i className="bi bi-plus-lg me-2" />}
                Save Actor
              </button>
          </aside>



          {/* Content right */}
          <main className="title-main">
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>{fullName || actor.name || actor.personId}</h1>
            <div className="details" style={{ marginTop: 0 }}>
              {/* Birth / Death */}
              {actor.birthdate && <div>Born: {actor.birthdate}</div>}
              {actor.deathdate && <div>Died: {actor.deathdate}</div>}
            </div>

            {/* Professions */}
              <ProfessionList items={((actor.professions && actor.professions.length) ? actor.professions : actor.Professions)} />
            
          </main>
        </div>
      </div>

      {knownForItems && knownForItems.length > 0 && (
        <div className="title-container">
          <KnownForGrid items={knownForItems} label="Known For" />
        </div>
      )}

      <div className="title-container">
        <CoPlayersGrid items={coplayers.slice((cpPage - 1) * CP_PAGE_SIZE, cpPage * CP_PAGE_SIZE)} pics={coplayerPics} />

        {coplayers && coplayers.length > 0 && (
          <div>
            {Math.ceil(coplayers.length / CP_PAGE_SIZE) > 1 && (
              <Pagination
                page={cpPage}
                onChange={(p) => setCpPage(p)}
                hasNext={cpPage < Math.ceil(coplayers.length / CP_PAGE_SIZE)}
                totalPages={Math.ceil(coplayers.length / CP_PAGE_SIZE)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}


export default ActorDetails;