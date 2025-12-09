import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import PosterPicture from './PosterPicture';

const ResultItem = ({ item, category }) => {
    const fullName = item.firstname + " " + item.lastname;
    const urlTitle = `/title/${item.titleId}`;
    const urlActor = `/actor/${item.personId}`;

    const isTitle = category === 'Titles';

    return (
        <Link to={isTitle ? urlTitle : urlActor}
            className="dropdown-item d-flex align-items-start p-2 border-bottom border-secondary custom-hover-item"
            style={{ whiteSpace: 'normal', color: 'white' }}
            type="button"
        >
            {isTitle ? <PosterPicture item={item} /> : <ProfilePicture item={item} />}
            <div className="d-flex flex-column justify-content-center text-start">
                <span className="fw-bold" style={{ fontSize: '15px', color: '#6abaf7' }}>
                    {isTitle ? item.title : fullName}
                </span>
                <span className="small text-light">
                    {isTitle ? item.releaseDate : item.birthdate}
                </span>
            </div>
        </Link>
    );
};

export default ResultItem;