import React from 'react';

const IMDB_YELLOW = '#f5c518';

export default function SmallButton({ children, onClick, disabled = false, ariaLabel, title }) {
  const baseStyle = {
    backgroundColor: IMDB_YELLOW,
    color: '#000',
    border: 'none',
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: '0.85rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      style={baseStyle}
      className="small-button"
    >
      {children}
    </button>
  );
}
