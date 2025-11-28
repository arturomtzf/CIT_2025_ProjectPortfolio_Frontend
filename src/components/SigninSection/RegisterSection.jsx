import { Link } from "react-router-dom";

const RegisterSection = () => (
    <>
        <div className="d-flex align-items-center w-100" style={{ maxWidth: '380px' }}>
            <div className="flex-grow-1 border-top border-secondary opacity-25"></div>
            <span className="flex-shrink-0 mx-4 text-secondary small">or</span>
            <div className="flex-grow-1 border-top border-secondary opacity-25"></div>
        </div>

        <p className="small text-muted w-100 mb-0" style={{ maxWidth: '380px' }}>
            Don't have an account?
        </p>

        <Link
            to={"/register"}
            className="btn btn-outline-secondary w-100 py-3 fw-bold rounded-3 shadow-sm"
            style={{ maxWidth: '380px', color: '#000', borderColor: '#ccc', backgroundColor: '#f8f9fa' }}
        >
            Create a new account
        </Link>

        <p className="text-muted small w-100" style={{ maxWidth: '380px', fontSize: '0.75rem' }}>
            By signing in, you agree to the Terms of Service and Privacy Policy.
        </p>
    </>
);

export default RegisterSection;