import React from 'react';
import SmallButton from '../Common/SmallButton';

const Pagination = ({ page, onChange, hasNext, totalPages }) => {
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(page + 1);

  const pageText = typeof totalPages === 'number' && totalPages > 0 ? `Page ${page} / ${totalPages}` : `Page ${page}`;

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginTop:16}}>
      <SmallButton onClick={prev} disabled={page <= 1} ariaLabel="Previous page">Prev</SmallButton>

      <div style={{color:'rgba(255,255,255,0.9)'}}>{pageText}</div>

      <SmallButton onClick={next} disabled={!hasNext} ariaLabel="Next page">Next</SmallButton>
    </div>
  );
};

export default Pagination;
