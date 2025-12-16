import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_POSTER = 'https://loremfaces.net/96/id/1.jpg';

export default function KnownForGrid({ items = [], label = 'Known For' }) {
	if (!items || items.length === 0) return null;

	const getPoster = (it) => {
		return (
			it.poster || it.posterUrl || it.image || it.poster_path || it.imageUrl || FALLBACK_POSTER
		);
	};

	const getTitle = (it) => {
		return (
			it.movietitle || it.name || it.Title || it.nameText || it.original_title || it.originalTitle || it.plotTitle || ''
		);
	};

	const getId = (it) => {
		return it.id || it.titleId || it.titleid || it.titleID || it._id || it.tmdb_id || null;
	};



	return (
		<section style={{ marginTop: 16 }}>
			<h4>{label}</h4>
			<div className="items-grid">
				{items.map((it) => {
					const poster = getPoster(it);
					const title = getTitle(it) || '';
					const id = getId(it);
					const key = id || title || poster;

					const titleToShow = title || (it.plot ? (it.plot.slice(0,60) + '...') : 'Untitled');

					const card = (
						<div key={key} className="item-card">
							<img
								src={poster}
								className="item-img"
								alt={titleToShow}
								onError={(e) => { if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER; }}
							/>
							<div className="item-body">
								<h6 className="item-title">{titleToShow}</h6>
							</div>
						</div>
					);

					return id ? (
						<Link key={key} to={`/title/${id}`} className="text-decoration-none">{card}</Link>
					) : (
						<div key={key}>{card}</div>
					);
				})}
			</div>
		</section>
	);
}
