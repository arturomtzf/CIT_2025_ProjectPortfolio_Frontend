import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NavButton = ({ icon, label, dropdownOptions, location }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDropdown = dropdownOptions && dropdownOptions.length > 0;

    const menuRef = useRef(null);

    // Logic to close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the menu is open AND the click is NOT inside our component
            if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Attach listener to the whole document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Cleanup listener when component is removed
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // If it's NOT a dropdown
    if (!isDropdown) {
        return (
            <div className="d-flex align-items-center position-relative">
                <Link
                    to={location}
                    className="btn d-flex align-items-center gap-2 fw-bold text-white border-0"
                    style={{ backgroundColor: 'transparent', textDecoration: 'none' }}
                >
                    {icon && <i className={`bi ${icon}`} style={{ fontSize: '1.2rem' }}></i>}
                    <span className="d-none d-md-block" style={{ fontSize: '14px' }}>
                        {label}
                    </span>
                </Link>
            </div>
        );
    }

    // If it's a dropdown
    return (
        <div ref={menuRef} className="dropdown d-flex align-items-center position-relative">
            <button
                className="btn d-flex align-items-center gap-2 fw-bold text-white border-0"
                style={{ backgroundColor: 'transparent' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {icon && <i className={`bi ${icon}`} style={{ fontSize: '1.2rem' }}></i>}
                <span className="d-none d-md-block" style={{ fontSize: '14px' }}>
                    {label}
                </span>
                {isDropdown && <i className="bi bi-caret-down-fill" style={{ fontSize: '0.7rem' }}></i>}
            </button>

            {isDropdown && (
                <ul
                    className={`dropdown-menu ${isOpen ? 'show' : ''}`}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        left: 'auto',
                        marginTop: '10px',
                        backgroundColor: '#1f1f1f',
                        border: '1px solid #333'
                    }}
                >
                    {dropdownOptions.map((option, index) => (
                        <li key={index}>
                            <Link
                                className="dropdown-item text-white"
                                to={option.url}
                                onClick={() => setIsOpen(false)}
                                style={{ fontSize: '14px' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {option.option}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NavButton;