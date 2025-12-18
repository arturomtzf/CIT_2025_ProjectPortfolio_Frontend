import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { ExploreGrid } from './TitlesListItems';
import { getRandomMovies } from '../../utils/titlesService';

function TitlesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [explorePage, setExplorePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const EXPLORE_PAGE_SIZE = 24;

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await getRandomMovies(9999);
        setMovies(items || []);
        setTotalPages(Math.max(1, Math.ceil((items?.length || 0) / EXPLORE_PAGE_SIZE)));
      } catch (err) {
        console.error('Error fetching random movies:', err);
        setError('Could not load movies from API.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <>

      <div className="list-container">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            {/* Explore - Random Movies */}
            <section style={{ marginBottom: 28 }}>
              <div className="d-flex align-items-center mb-3">
                <h4 className="text-warning fw-bold m-0">Explore</h4>
              </div>
              <ExploreGrid items={movies.slice((explorePage - 1) * EXPLORE_PAGE_SIZE, explorePage * EXPLORE_PAGE_SIZE)} />
              <Pagination page={explorePage} onChange={setExplorePage} hasNext={explorePage < totalPages} totalPages={totalPages} />
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default TitlesList;  