import { Link } from 'react-router-dom';

const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f',
        '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c',
        '#689f38', '#afb42b', '#fbc02d', '#ffa000', '#f57c00',
        '#e64a19', '#5d4037', '#616161', '#455a64'
    ];
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

const BornTodayItem = ({ person }) => {
    const bgColor = getColorFromName(person.firstname + " " + person.lastname);
    const initials = getInitials(person.firstname + " " + person.lastname);

    return (
        <div className="d-flex flex-column align-items-center text-center" style={{ width: '170px', flexShrink: 0 }}>
            {/* Circular Avatar */}
            <Link to={'/actor/' + person.personId} className="text-decoration-none">
                <div
                    className="rounded-circle mb-3 d-flex justify-content-center align-items-center shadow-sm"
                    style={{
                        width: '150px',
                        height: '150px',
                        backgroundColor: bgColor,
                        border: '4px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span className="text-white fw-bold" style={{ fontSize: '3.5rem', userSelect: 'none' }}>
                        {initials}
                    </span>
                </div>
            </ Link>

            {/* Name */}
            <h6 className="text-white fw-bold mb-1 text-truncate w-100" title={person.firstname + " " + person.lastname}>
                {person.firstname + " " + person.lastname}
            </h6>

            {/* Age */}
            <span className="text-secondary small">
                {person.yearsOld}
            </span>
        </div>
    );
};

export default BornTodayItem;