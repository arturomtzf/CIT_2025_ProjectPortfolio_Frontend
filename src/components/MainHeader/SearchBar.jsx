import { useState, useEffect, useRef } from 'react';

const SearchBar = () => {
    const [category, setCategory] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchRef = useRef(null);

    const categories = ['All', 'Titles', 'Actors']; // Might be good to change to get categories from db

    // Logic to close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the menu is open AND the click is NOT inside our component
            if (isDropdownOpen && searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Attach listener to the whole document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Cleanup listener when component is removed
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div ref={searchRef} className="input-group flex-grow-1" style={{ maxWidth: '600px' }}>

            <div className="dropdown">
                <button
                    className="btn btn-light dropdown-toggle fw-bold border-0 h-100 d-flex align-items-center"
                    type="button"
                    style={{
                        fontSize: '14px',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        paddingTop: '6px',
                        paddingBottom: '6px'
                    }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {category}
                </button>

                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setCategory(cat);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <input
                type="text"
                className="form-control border-0"
                placeholder="Search"
                style={{ paddingTop: '6px', paddingBottom: '6px' }}
            />

            <button className="btn btn-light border-0" type="button">
                <i className="bi bi-search text-secondary"></i>
            </button>
        </div>
    );
};

export default SearchBar;