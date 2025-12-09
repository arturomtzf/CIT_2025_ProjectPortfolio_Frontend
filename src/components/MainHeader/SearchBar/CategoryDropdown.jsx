const CategoryDropdown = ({ currentCategory, categories, isOpen, setIsOpen, onSelect }) => {
    return (
        <div className="dropdown">
            <button
                className="btn btn-light dropdown-toggle fw-bold border-0 h-100 d-flex align-items-center"
                type="button"
                style={{
                    fontSize: '14px',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    backgroundColor: '#f8f9fa'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {currentCategory}
            </button>

            <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                {categories.map((cat) => (
                    <li key={cat}>
                        <button className="dropdown-item" onClick={() => onSelect(cat)}>
                            {cat}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryDropdown;