import { Link } from "react-router-dom";

const ImdbLogo = () => (
    <Link to="/" className="text-decoration-none me-3">
        <div
            className="d-flex align-items-center justify-content-center fw-bold rounded"
            style={{
                backgroundColor: '#F5C518',
                color: '#000000',
                width: '64px',
                height: '32px',
                fontSize: '15px'
            }}
        >
            IMDb
        </div>
    </Link>
);

export default ImdbLogo;