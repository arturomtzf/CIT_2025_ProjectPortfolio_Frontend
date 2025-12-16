import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMoviePoster } from '../../hooks/useMoviePoster';
import { getProfilePicture } from '../../utils/picturesHelper';

export function ActorPoster({ actor, className = '', style = {}, alt }) {
  const primary = actor?.photo || actor?.headshot || null;
  const secondary = actor?.photo2 || actor?.backupPhoto || null;
  const key = actor?.personId || actor?.id || actor?.name || null;
  const { currentSrc, handleError } = useMoviePoster(primary, secondary, key);

  const [tmdbSrc, setTmdbSrc] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const lookupKey = actor?.personId || actor?.id || actor?.name || null;
      if (!lookupKey) return;
      try {
        const path = await getProfilePicture(lookupKey);
        if (!mounted) return;
        if (path) setTmdbSrc(`https://image.tmdb.org/t/p/w300_and_h450_face${path}`);
      } catch (err) {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, [actor?.personId, actor?.id, actor?.name]);

  const src = tmdbSrc || currentSrc;
  const onError = tmdbSrc ? () => setTmdbSrc(null) : handleError;

  return (
    <img src={src} alt={alt} className={className} style={style} onError={onError} />
  );
}

export const GenreBadges = ({ items = [] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="badges-wrap" style={{ marginTop: 12 }}>
      {items.map((g) => (
        <div key={g} className="badge">{g}</div>
      ))}
    </div>
  );
};

export const DirectorList = ({ directors = [] }) => {
  if (!directors || directors.length === 0) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <span className="meta-small" style={{ marginRight: 8 }}>Director</span>
      {directors.map((d, i) => {
        const name = d.name || `${d.firstname || ''} ${d.lastname || ''}`.trim();
        const content = d.personId ? (
          <Link key={d.personId} to={`/actor/${d.personId}`} style={{ color: '#fff', textDecoration: 'none' }}>{name}</Link>
        ) : (
          <span key={name + i}>{name}</span>
        );
        return (
          <span key={(d.personId || name) + '_dir'}>
            {content}{i < directors.length - 1 ? ', ' : ''}
          </span>
        );
      })}
    </div>
  );
};

export const WriterList = ({ writers = [] }) => {
  if (!writers || writers.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <span className="meta-small" style={{ marginRight: 8 }}>Writer</span>
      {writers.map((w, i) => {
        const name = w.name || `${w.firstname || ''} ${w.lastname || ''}`.trim();
        const content = w.personId ? (
          <Link key={w.personId} to={`/actor/${w.personId}`} style={{ color: '#fff', textDecoration: 'none' }}>{name}</Link>
        ) : (
          <span key={name + i}>{name}</span>
        );
        return (
          <span key={(w.personId || name) + '_wri'}>
            {content}{i < writers.length - 1 ? ', ' : ''}
          </span>
        );
      })}
    </div>
  );
};

export const StarsGrid = ({ actors = [] }) => {
  if (!actors || actors.length === 0) return <p>No cast information.</p>;
  return (
    <div className="items-grid">
      {actors.map((actor, idx) => {
        const isString = typeof actor === 'string';
        const actorName = isString ? actor : (actor.name || `${actor.firstname || ''} ${actor.lastname || ''}`.trim());
        const actorId = isString ? null : actor.personId;
        const card = (
          <div className="item-card">
            <ActorPoster actor={actor} className="item-img" style={{ height: '260px', objectFit: 'cover' }} alt={actorName} />
            <div className="item-body">
              <h6 className="item-title">{actorName}</h6>
            </div>
          </div>
        );
        return actorId ? (
          <Link key={actorId} to={`/actor/${actorId}`} className="text-decoration-none">{card}</Link>
        ) : (
          <div key={idx}>{card}</div>
        );
      })}
    </div>
  );
};
