export default function WatchlistButton() {
  return (
    <button
      className="btn btn-dark w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2 mt-auto text-primary"
      style={{ backgroundColor: '#2c2c2c', border: 'none', fontSize: '0.9rem' }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#3c3c3c'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#2c2c2c'}
    >
      <i className="bi bi-plus-lg me-2"></i> Watchlist
    </button>
  );
}
