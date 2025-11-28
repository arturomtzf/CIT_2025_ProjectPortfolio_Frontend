const SigninButton = ({ isLoggingIn }) => {
    return (
        <button
            type="submit"
            className="btn btn-warning w-100 d-flex justify-content-center align-items-center py-3 fw-bold rounded-3 shadow-sm transition-opacity"
            disabled={isLoggingIn}
            style={{ backgroundColor: '#f5c518', borderColor: '#f5c518', color: '#000' }}
        >
            {isLoggingIn ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : (
                'Sign In'
            )}
        </button>
    );
}

export default SigninButton;