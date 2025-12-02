import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader.jsx';

const FALLBACK_POSTER = 'https://cataas.com/cat';

function ActorsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try actor endpoint; fallback to movies if not available
        let res = await fetch(`/api/actors?page=1&pageSize=24`);
        if (!res.ok) {
          res = await fetch(`/api/movies?page=1&pageSize=24`);
        }
        if (!res.ok) throw new Error('Failed to fetch list');
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.error('Error fetching list:', err);
        setError('Could not load list from API.');
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  return (
    <>
      <MainHeader />
      <div className="list-container">
        <h3 style={{marginBottom:12}}>People</h3>

        {loading && <div>Loading...</div>}
        {error && <div style={{color:'#f66'}}>{error}</div>}

        {!loading && !error && (
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
                    <img src={m.photo || m.poster || FALLBACK_POSTER} className="item-img" alt={titleText} onError={(e)=>{e.currentTarget.src = FALLBACK_POSTER}} />
                    <div className="item-body">
                      <h6 className="item-title">{titleText}</h6>
                      <div className="item-sub">{sub}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default ActorsList;