import { useState, useEffect, useRef } from 'react';
import CategoryDropdown from './SearchBar/CategoryDropdown';
import SearchResults from './SearchBar/SearchResults';
import { getSearchedTitles, getSearchedActors } from '../../utils/searchHelper';

const SearchBar = () => {
    const [category, setCategory] = useState('Titles');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const searchRef = useRef(null);
    const categories = ['Titles', 'Actors'];

    useEffect(() => {
        // Clear results if query is empty
        if (query.length === 0) {
            setResults([]);
            setShowResults(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setShowResults(true);

        // Create controller
        const controller = new AbortController();
        const signal = controller.signal;

        const delaySearch = setTimeout(async () => {
            try {
                let filteredData = [];

                if (category === 'Titles') {
                    filteredData = await getSearchedTitles(query, signal);
                } else {
                    filteredData = await getSearchedActors(query, signal);
                }

                console.log(filteredData);
                setResults(filteredData || []);
                setIsLoading(false);

            } catch (error) {
                // Ignore errors caused by aborting
                if (error.name !== 'AbortError') {
                    console.error("Search failed", error);
                    setIsLoading(false);
                }
            }
        }, 300);

        // Cleanup function
        return () => {
            controller.abort();
            clearTimeout(delaySearch);
        };
    }, [query, category]);

    // Click Outside Logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <style>
                {`
                    .custom-hover-item:hover {
                        background-color: #343a40 !important;
                        cursor: pointer;
                    }
                    .custom-hover-item:hover span.text-light {
                        color: #f8f9fa !important;
                    }
                `}
            </style>

            <div ref={searchRef} className="input-group flex-grow-1 position-relative" style={{ maxWidth: '600px' }}>

                <CategoryDropdown
                    currentCategory={category}
                    categories={categories}
                    isOpen={isDropdownOpen}
                    setIsOpen={setIsDropdownOpen}
                    onSelect={(cat) => {
                        setCategory(cat);
                        setIsDropdownOpen(false);
                    }}
                />

                <input
                    type="text"
                    className="form-control border-0"
                    placeholder={`Search ${category}...`}
                    style={{ paddingTop: '6px', paddingBottom: '6px' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0 || isLoading) setShowResults(true); }}
                />

                <button className="btn btn-light border-0" type="button">
                    <i className="bi bi-search text-secondary"></i>
                </button>

                <SearchResults
                    results={results}
                    show={showResults}
                    isLoading={isLoading}
                    category={category}
                />
            </div>
        </>
    );
};

export default SearchBar;