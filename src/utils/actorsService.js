const API_URL = import.meta.env.VITE_API_URL;


 //Fetch all actors with optional pagination
export async function getActors(pageSize = 9999) {
  try {
    const res = await fetch(`/api/actors?pageSize=${pageSize}`);
    if (!res.ok) throw new Error(`Failed to fetch actors, status ${res.status}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    } else if (data) {
      return data.items || data.results || data.data || [];
    }
    return [];
  } catch (err) {
    console.error('Error in getActors:', err);
    throw err;
  }
}

// Fetch a single actor by ID
export async function getActorById(id) {
  try {
    const res = await fetch(`/api/actors/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch actor, status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error in getActorById(${id}):`, err);
    throw err;
  }
}

// Fetch co-players for a given actor name
export async function getCoPlayers(actorName, signal = null) {
  try {
    const options = signal ? { signal } : {};
    const res = await fetch(`/api/actors/${encodeURIComponent(actorName)}/coplayers`, options);
    
    if (!res.ok) {
      console.warn('Co-players endpoint returned', res.status, 'for', actorName);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.error(`Error in getCoPlayers(${actorName}):`, err);
    throw err;
  }
}

// Search actors by query
export async function searchActors(query, page = 1, pageSize = 8, signal = null) {
  try {
    const url = `${API_URL}/actors/search?page=${page}&pageSize=${pageSize}&name=${encodeURIComponent(query)}`;
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
    console.error('Error in searchActors:', err);
    throw err;
  }
}
