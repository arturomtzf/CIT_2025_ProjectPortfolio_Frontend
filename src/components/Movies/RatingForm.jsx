import { useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { getToken } from '../../utils/tokenHelper';

// static suggested keywords the user can click to use as a comment
const SUGGESTED = [
    'Great', 'Funny', 'Emotional', 'Slow',
    'Classic', 'Loved it', 'Scary', 'bad', 
    'Amazing', 'Boring', 'Incredible', 'Romantic', 
    'Exciting', 'Predictable', 'Outstanding', 'Mediocre', 
    'Hilarious', 'Touching', 'Cliché', 'Masterpiece'
];

export default function RatingForm({ id, title, setTitle, onClose }) {
  const [ratingValue, setRatingValue] = useState(8);
  // optional single suggested keyword for comment
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  // comments list used to build the wordcloud.
  const [commentsList, setCommentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [hoverValue, setHoverValue] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!ratingValue || ratingValue < 1 || ratingValue > 10) {
      setMsg({ type: 'error', text: 'Please pick a rating between 1 and 10.' });
      return;
    }

    const prevRating = (title && typeof title.rating === 'number') ? title.rating : null;
    const prevVotes = (title && typeof title.numberOfVotes === 'number') ? title.numberOfVotes : 0;
    const newVotes = (prevVotes || 0) + 1;
    const newAvg = (prevRating != null ? ((prevRating * prevVotes) + ratingValue) / newVotes : ratingValue);

    setTitle(prev => ({ ...prev, rating: newAvg, numberOfVotes: newVotes }));

    const commentText = selectedKeyword ? selectedKeyword : '';

    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/movies/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {})
        },
        body: JSON.stringify({ Rating: ratingValue, Comment: commentText })
      });

      if (res.status === 401) {
        setTitle(prev => ({ ...prev, rating: prevRating, numberOfVotes: prevVotes }));
        setMsg({ type: 'error', text: 'You must be signed in to rate.' });
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => 'Failed to submit rating');
        setTitle(prev => ({ ...prev, rating: prevRating, numberOfVotes: prevVotes }));
        setMsg({ type: 'error', text: txt || 'Failed to submit rating' });
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setTitle(prev => ({ ...prev, rating: data.rating ?? data.Rating ?? prev.rating, numberOfVotes: data.votes ?? data.Votes ?? data.numberOfVotes ?? prev.numberOfVotes }));
      setMsg({ type: 'success', text: 'Rating submitted — thank you!' });
      // add the comment to local list for wordcloud (if provided)
      if (commentText) {
        setCommentsList(prev => [commentText, ...prev]);
      }
      setSelectedKeyword(null);
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      console.error('Rating error', err);
      setTitle(prev => ({ ...prev, rating: prevRating, numberOfVotes: prevVotes }));
      setMsg({ type: 'error', text: 'Network error submitting rating' });
    } finally {
      setSubmitting(false);
    }
  };

  // Build word counts only from the hardcoded SUGGESTED keywords
  const countsMap = (() => {
    const m = new Map();
    // initialize counts to 0 for each suggestion
    for (const kw of SUGGESTED) m.set(kw.toLowerCase(), 0);
    for (const c of commentsList) {
      if (!c) continue;
      const lc = (c || '').toLowerCase();
      if (m.has(lc)) m.set(lc, m.get(lc) + 1);
    }
    return m;
  })();

  // words array for the cloud
  const words = (() => {
    const arr = [];
    for (const kw of SUGGESTED) {
      const count = countsMap.get(kw.toLowerCase()) || 0;
      if (count > 0) arr.push({ text: kw, value: count });
    }
    if (arr.length === 0) return [{ text: 'its quiet here', value: 1 }];
    return arr.sort((a, b) => b.value - a.value);
  })();

  // pick a single keyword; clicking an already-selected keyword clears it
  const toggleKeyword = (kw) => {
    setSelectedKeyword(prev => (prev === kw ? null : kw));
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 6 }}>Your rating</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 6, marginBottom: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1;
              const active = (hoverValue || ratingValue) >= val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRatingValue(val)}
                  onMouseEnter={() => setHoverValue(val)}
                  onMouseLeave={() => setHoverValue(0)}
                  aria-label={`${val} star`}
                  style={{ border: 'none', background: 'transparent', color: active ? '#ffd54f' : 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 4 }}
                >
                  ★
                </button>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const val = 5 + i + 1;
              const active = (hoverValue || ratingValue) >= val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRatingValue(val)}
                  onMouseEnter={() => setHoverValue(val)}
                  onMouseLeave={() => setHoverValue(0)}
                  aria-label={`${val} stars`}
                  style={{ border: 'none', background: 'transparent', color: active ? '#ffd54f' : 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 4 }}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 260, minHeight: 120, background: 'transparent' }}>
            <ReactWordcloud words={words} options={{ rotations: 2, rotationAngles: [-15, 15] }} minSize={[260, 120]} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexDirection: 'column', flex: '1 1 100%' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6, alignItems: 'center' }}>
              {SUGGESTED.map((kw) => {
                const isActive = selectedKeyword === kw;
                const count = countsMap.get(kw.toLowerCase()) || 0;
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => toggleKeyword(kw)}
                    className={isActive ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-outline-light'}
                    style={{ cursor: 'pointer' }}
                  >
                    {kw}{count ? ` (${count})` : ''}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', minHeight: 54, paddingLeft: 6 }}>
                {selectedKeyword ? <span className="badge">{selectedKeyword}{countsMap.get(selectedKeyword.toLowerCase()) ? ` (${countsMap.get(selectedKeyword.toLowerCase())})` : ''}</span> : <div className="text-secondary small">No keyword selected</div>}
              </div>

              <button type="submit" className="btn btn-sm btn-warning" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>

        {msg && (
          <div style={{ marginTop: 8 }} className={msg.type === 'error' ? 'text-danger small' : 'text-success small'}>{msg.text}</div>
        )}
      </div>
    </form>
  );
}
