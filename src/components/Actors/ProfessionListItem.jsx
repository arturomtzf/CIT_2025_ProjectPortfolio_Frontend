import React from 'react';

function ProfessionList({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="professions" style={{ marginTop: 12 }}>
      <h5 style={{ marginBottom: 8 }}>Professions</h5>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((profession, idx) => {
          // Handle both string and object formats
          const profName = typeof profession === 'string' ? profession : (profession?.name || profession?.professionName || '');
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: '#555', color: '#fff', padding: '6px 12px' }}
            >
              {profName}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default ProfessionList;

