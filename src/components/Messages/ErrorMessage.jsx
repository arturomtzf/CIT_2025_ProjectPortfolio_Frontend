const ErrorMessage = ({ isVisible, message }) => {
    if (!isVisible) return null;

    return (
        <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 mb-3" role="alert" style={{ maxWidth: '380px' }}>
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
            <div>
                {message}
            </div>
        </div>
    );
};

export default ErrorMessage;