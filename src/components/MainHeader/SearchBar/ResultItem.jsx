import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import PosterPicture from './PosterPicture';
import { postSearchedTitle } from '../../../utils/searchHelper';

const ResultItem = ({ item, category }) => {
    const navigate = useNavigate();
    const fullName = item.firstname + " " + item.lastname;
    const url = category === "Titles"
        ? `/title/${item.titleId}`
        : `/actor/${item.personId}`;

    const isTitle = category === 'Titles';

    const handleClick = () => {
        if (category === "Titles")
            postSearchedTitle(item.titleId);

        navigate(url);
    };

    return (
        <button
            onClick={handleClick}
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
        </button>
    );
};

export default ResultItem;