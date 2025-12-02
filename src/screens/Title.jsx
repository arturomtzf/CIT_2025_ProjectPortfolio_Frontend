// src/screens/TitleDetails/TitleDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Title() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTitle(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load title');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{title.title}</h1>
      <p>{title.description}</p>

      <h3>Genres</h3>
      <ul>
        {title.genres?.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>

      <h3>Cast</h3>
      <ul>
        {title.cast?.map((c) => (
          <li key={c.personId}>
            {c.name} — {c.role} ({c.characters})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Title;
