import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfilePicture } from '../../utils/picturesHelper';
import { FALLBACK_POSTER } from '../../utils/constants';

export function ActorTile({ item, alt }) {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPicture = async () => {
      if (!item || !item.personId) return;
      try {
        const pic = await getProfilePicture(item.personId);
        if (!mounted) return;
        setProfilePicture(pic ? `https://image.tmdb.org/t/p/w300_and_h450_face${pic}` : null);
      } catch (err) {
        if (!mounted) return;
        setProfilePicture(null);
      }
    };
    fetchPicture();

    return () => { mounted = false; };
  }, [item && item.personId]);

  const src = profilePicture || item?.photo || FALLBACK_POSTER;

  return (
    <img src={src} className="item-img" alt={alt} onError={(e) => { if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER; }} />
  );
}

export function ActorListCard({ item }) {
  if (!item) return null;
  
  const isPerson = !!item.personId;
  const key = isPerson ? item.personId : item.id;
  const to = isPerson ? `/actor/${item.personId}` : `/title/${item.id}`;
  const titleText = isPerson ? `${item.firstname || ''} ${item.lastname || ''}`.trim() : (item.title || 'Untitled');
  const sub = isPerson
    ? (item.averagerating != null
      ? `${item.averagerating.toFixed ? item.averagerating.toFixed(1) : item.averagerating} ★`
      : (item.numvotes ? `${item.numvotes} votes` : ''))
    : (item.date ? item.date : (item.averageRating ? `${item.averageRating} ★` : ''));

  return (
    <Link key={key} to={to} className="text-decoration-none">
      <div className="item-card">
        <ActorTile item={item} alt={titleText} />
        <div className="item-body">
          <h6 className="item-title">{titleText}</h6>
          <div className="item-sub">{sub}</div>
        </div>
      </div>
    </Link>
  );
}
