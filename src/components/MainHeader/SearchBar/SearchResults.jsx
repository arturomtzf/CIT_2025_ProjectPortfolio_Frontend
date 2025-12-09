import LoadingItem from "./LoadingItem";
import ResultItem from "./ResultItem";

const SearchResults = ({ results, show, isLoading, category }) => {
    if (!show || !results || (!isLoading && results.length === 0)) return null;

    return (
        <div
            className="dropdown-menu show w-100 p-0 border-0 shadow"
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                backgroundColor: '#212529',
                borderRadius: '0 0 8px 8px'
            }}
        >
            {isLoading ? (
                <LoadingItem />
            ) : (
                results.map((item) => (
                    <ResultItem key={item.titleId || item.personId} item={item} category={category} />
                ))
            )}
        </div>
    );
};

export default SearchResults;