const API_URL = import.meta.env.VITE_API_URL;

// Fetch all titles/movies with optional pagination
export async function getRandomMovies(pageSize = 9999) {
  try {
    const res = await fetch(`/api/movies/random?pageSize=${pageSize}`);
    if (!res.ok) throw new Error(`Failed to fetch random movies, status ${res.status}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    } else if (data) {
      return data.items || data.results || data.data || data.movies || [];
    }
    return [];
  } catch (err) {
    console.error('Error in getRandomMovies:', err);
    throw err;
  }
}

// Fetch a single title/movie by ID
export async function getTitleById(id) {
  try {
    const res = await fetch(`/api/movies/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch title, status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error in getTitleById(${id}):`, err);
    throw err;
  }
}

// Fetch popular movies/titles
export async function getPopularMovies(page = 1, pageSize = 100) {
  try {
    const url = API_URL 
      ? `${API_URL}/movies/popular?page=${page}&pageSize=${pageSize}` 
      : `/api/movies/popular?page=${page}&pageSize=${pageSize}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch popular movies, status ${res.status}`);
    const data = await res.json();

    return Array.isArray(data) 
      ? data 
      : (data && (data.items || data.results || data.movies || data.data)) || [];
  } catch (err) {
    console.error('Error in getPopularMovies:', err);
    throw err;
  }
}

// Search titles by query
export async function searchTitles(query, page = 1, pageSize = 8, signal = null) {
  try {
    const url = `${API_URL}/movies/search?page=${page}&pageSize=${pageSize}&query=${encodeURIComponent(query)}`;
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Search failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.error('Error in searchTitles:', err);
    throw err;
  }
}
