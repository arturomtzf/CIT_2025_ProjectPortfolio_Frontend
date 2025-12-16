import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMoviePoster } from '../../hooks/useMoviePoster';
import { getPosterPicture } from '../../utils/picturesHelper';

export function MoviePoster({ movie, className = '', style = {}, alt }) {
  const [fetchedPoster2, setFetchedPoster2] = useState(null);
  const primary = movie?.poster || null;
  const secondary = null;
  const idKey = movie?.titleid || null;

  useEffect(() => {
    let mounted = true;
    const fetchPicture = async () => {
      try {
        const second = await getPosterPicture(movie?.title || '');
        if (!mounted) return;
        if (second) setFetchedPoster2('https://image.tmdb.org/t/p/w600_and_h900_face/' + second);
      } catch (err) {
        // ignore
      }
    };
    if (movie?.title) fetchPicture();
    return () => { mounted = false; };
  }, [movie?.title]);

  const { currentSrc, handleError } = useMoviePoster(primary, fetchedPoster2 || secondary, idKey);
  return (
    <img
      src={currentSrc}
      alt={alt || (movie?.title || 'poster')}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

export function MovieCard({ m }) {
  const titleText = m?.title || 'Untitled';
  const rating = m?.averagerating ?? '';
  const id = m?.titleid || titleText;
  return (
    <Link key={id} to={`/title/${id}`} className="item-card">
      <MoviePoster movie={m} className="item-img w-100 rounded-1" style={{ cursor: 'pointer' }} alt={titleText} />
      <div className="item-body">
        <div className="item-title">{titleText}</div>
        <div className="item-sub">
          {rating ? (
            <div className="d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <i className="bi bi-star-fill text-warning me-1"></i>
              <span className="text-white">{rating}</span>
            </div>
          ) : ''}
        </div>
      </div>
    </Link>
  );
}

export function ExploreGrid({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <div className="items-grid">
        {items.map((it) => (
          <MovieCard key={it?.id || it?._id || it?.movieId || (it?.title || it?.Title)} m={it} />
        ))}
      </div>
    </>
  );
}
