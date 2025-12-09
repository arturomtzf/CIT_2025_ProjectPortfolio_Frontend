const LoadingItem = () => {
    return (
        <div className="p-3 text-center">
            <div className="spinner-border text-light" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingItem;