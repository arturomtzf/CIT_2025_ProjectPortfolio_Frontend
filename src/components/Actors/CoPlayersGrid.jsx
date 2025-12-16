import React from 'react';
import { Link } from 'react-router-dom';
import { FALLBACK_POSTER } from '../../utils/constants';

export default function CoPlayersGrid({ items = [], pics = {} }) {
  if (!items || items.length === 0) return null;
  return (
    <section style={{ marginTop: 16 }}>
      <h4>Co-Players</h4>
      <div className="items-grid">
        {items.map((cp) => {
          const name = cp.fullname || cp.name || `${cp.firstname || ''} ${cp.lastname || ''}`.trim();
          const pid = cp.personId;
          const cpPic = pid ? (pics[pid] || null) : null;
          const src = cpPic || cp.photo || FALLBACK_POSTER;
          const card = (
            <div className="item-card">
              <img src={src} className="item-img" alt={name} onError={(e) => {
                  if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER)
                    e.currentTarget.src = FALLBACK_POSTER;
                }}
              />
              <div className="item-body">
                <h6 className="item-title">{name}</h6>
                {cp.frequency && <p className="item-sub">Appeared together {cp.frequency} time(s)</p>}
              </div>
            </div>
          );
          return pid ? (
            <Link key={pid} to={`/actor/${pid}`} className="text-decoration-none">{card}</Link>
          ) : (
            <div key={pid || name}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
