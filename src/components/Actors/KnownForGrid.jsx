import React from "react";
import { Link } from "react-router-dom";
import { FALLBACK_POSTER } from '../../utils/constants';

export default function KnownForGrid({ items = [], label = 'Known For' }) {
	if (!items || items.length === 0) return null;

	const getPoster = (it) => {
		return it.poster || FALLBACK_POSTER;
	};

	const getTitle = (it) => {
		return it.plot ? it.plot.slice(0, 60) + '...' : 'Untitled';
	};

	const getId = (it) => {
		return it.titleid || null;
	};



	return (
		<section style={{ marginTop: 16 }}>
			<h4>{label}</h4>
			<div className="items-grid">
				{items.map((it) => {
					const poster = getPoster(it);
					const title = getTitle(it);
					const id = getId(it);
					const key = id || title || poster;

					const card = (
						<div key={key} className="item-card">
							<img
								src={poster}
								className="item-img"
								alt={title}
								onError={(e) => { if (e?.currentTarget && e.currentTarget.src !== FALLBACK_POSTER) e.currentTarget.src = FALLBACK_POSTER; }}
							/>
							<div className="item-body">
								<h6 className="item-title">{title}</h6>
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
