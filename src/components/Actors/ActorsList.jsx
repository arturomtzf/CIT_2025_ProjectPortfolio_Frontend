import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { ActorListCard } from './ActorsListItems';
import { getActors } from '../../utils/actorsService';

function ActorsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ActorListpage, setActorListPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ACTORS_PAGE_SIZE = 24;

  useEffect(() => {
    const loadActors = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getActors(9999);
        setItems(list || []);
        setTotalPages(Math.max(1, Math.ceil((list?.length || 0) / ACTORS_PAGE_SIZE)));
      } catch (err) {
        console.error('Error fetching actors:', err);
        setError('Could not load actors from API.');
      } finally {
        setLoading(false);
      }
    };

    loadActors();
  }, []);

  return (
    <>
      <div className="list-container">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            {/* Actors & Actresses */}
            <section style={{ marginBottom: 28 }}>
              <div className="d-flex align-items-center mb-3">
                <h4 className="text-warning fw-bold m-0">Actors & Actresses</h4>
              </div>
              <div className="items-grid">
                {items.slice((ActorListpage - 1) * ACTORS_PAGE_SIZE, ActorListpage * ACTORS_PAGE_SIZE).map((m) => (
                  <ActorListCard key={m.personId || m.id} item={m} />
                ))}
              </div>
              <Pagination page={ActorListpage} onChange={setActorListPage} hasNext={ActorListpage < totalPages} totalPages={totalPages} />
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default ActorsList;