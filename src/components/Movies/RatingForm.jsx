import { useState } from 'react';
import { getToken } from '../../utils/tokenHelper';

export default function RatingForm({ id, title, setTitle, onClose }) {
  const [ratingValue, setRatingValue] = useState(8);
  const [comment, setComment] = useState('');
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

    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/movies/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {})
        },
        body: JSON.stringify({ Rating: ratingValue, Comment: comment })
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
      setComment('');
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      console.error('Rating error', err);
      setTitle(prev => ({ ...prev, rating: prevRating, numberOfVotes: prevVotes }));
      setMsg({ type: 'error', text: 'Network error submitting rating' });
    } finally {
      setSubmitting(false);
    }
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

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment" rows={2} style={{ flex: '1 1 100%', minWidth: 220 }} className="form-control form-control-sm" />

          <button type="submit" className="btn btn-sm btn-warning" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
        </div>

        {msg && (
          <div style={{ marginTop: 8 }} className={msg.type === 'error' ? 'text-danger small' : 'text-success small'}>{msg.text}</div>
        )}
      </div>
    </form>
  );
}
