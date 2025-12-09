import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfilePicture } from '../../utils/picturesHelper';

const BornTodayItem = ({ person }) => {
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchPicture = async () => {
            const pic = await getProfilePicture(person.personId);
            setProfilePicture(pic);
        };

        fetchPicture();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center text-center" style={{ width: '170px', flexShrink: 0 }}>
            <Link to={'/actor/' + person.personId} className="text-decoration-none">
                <div
                    className="rounded-circle mb-3 d-flex justify-content-center align-items-center shadow-sm"
                    style={{
                        width: '150px',
                        height: '150px',
                        border: '4px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        overflow: 'hidden'
                    }}
                >
                    {profilePicture ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w300_and_h450_face${profilePicture}`}
                            alt={person.firstname}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <i
                            className="bi bi-person"
                            style={{ fontSize: '9rem', color: 'white', opacity: 0.8 }}
                        />
                    )}
                </div>
            </Link>


            <h6 className="text-white fw-bold mb-1 text-truncate w-100">
                {person.firstname} {person.lastname}
            </h6>

            <span className="text-secondary small">{person.yearsOld}</span>
        </div>
    );
};

export default BornTodayItem;
