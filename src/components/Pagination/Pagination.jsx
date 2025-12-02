import React from 'react';

const Pagination = ({ page, onChange, hasNext }) => {
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(page + 1);

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginTop:16}}>
      <button
        className="btn btn-sm btn-outline-light"
        onClick={prev}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      <div style={{color:'rgba(255,255,255,0.9)'}}>Page {page}</div>

      <button
        className="btn btn-sm btn-outline-light"
        onClick={next}
        disabled={!hasNext}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
