import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { getProfilePicture } from '../../utils/picturesHelper';


const FALLBACK_POSTER = 'https://loremfaces.net/96/id/1.jpg';

// Component to render the image for an actor or movie item.
function ActorTile({ item, alt }) {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPicture = async () => {
      if (!item || !item.personId) return;
      try {
        const pic = await getProfilePicture(item.personId);
        if (!mounted) return;
        setProfilePicture(pic ? `https://image.tmdb.org/t/p/w300_and_h450_face${pic}` : null);
      } catch (err) {
        if (!mounted) return;
        setProfilePicture(null);
      }
    };
    fetchPicture();
    return () => { mounted = false; };
  }, [item && item.personId]);

  const src = item && item.personId
    ? (profilePicture || item.photo || item.poster || FALLBACK_POSTER)
    : (item.poster || item.photo || FALLBACK_POSTER);

  return (
    <img src={src} className="item-img" alt={alt} onError={(e) => { if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER; }} />
  );
}

function ActorsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try actor endpoint; fallback to movies if not available
        let res = await fetch(`/api/actors?page=${page}&pageSize=${pageSize}`);
        if (!res.ok) throw new Error(`Failed to fetch actors, status ${res.status}`);
        const data = await res.json();

        // Normalize response shape
        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (data) {
          list = data.items || data.results || data.data || [];
        }

        setItems(list || []);
        setHasNext(Array.isArray(list) ? list.length >= pageSize : false);
      } catch (err) {
        console.error('Error fetching list:', err);
        setError('Could not load list from API.');
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [page]);

  return (
    <>
      <div className="list-container">
        <h3 style={{marginBottom:12}}>People</h3>

        {loading && <div>Loading...</div>}
        {error && <div style={{color:'#f66'}}>{error}</div>}

        {!loading && !error && (
          <>
            <div className="items-grid">
              {items.map((m) => {
                const isPerson = !!m.personId;
                const key = isPerson ? m.personId : m.id;
                const to = isPerson ? `/actor/${m.personId}` : `/title/${m.id}`;
                const titleText = isPerson ? `${m.firstname || ''} ${m.lastname || ''}`.trim() : (m.title || 'Untitled');
                const sub = isPerson ? (m.averagerating != null ? `${m.averagerating.toFixed ? m.averagerating.toFixed(1) : m.averagerating} ★` : (m.numvotes ? `${m.numvotes} votes` : '')) : (m.date ? m.date : (m.averageRating ? `${m.averageRating} ★` : ''));

                return (
                  <Link key={key} to={to} className="text-decoration-none">
                    <div className="item-card">
                      <ActorTile item={m} alt={titleText} />
                      <div className="item-body">
                        <h6 className="item-title">{titleText}</h6>
                        <div className="item-sub">{sub}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination page={page} onChange={(p) => setPage(p)} hasNext={hasNext} />
          </>
        )}
      </div>
    </>
  );
}

export default ActorsList;