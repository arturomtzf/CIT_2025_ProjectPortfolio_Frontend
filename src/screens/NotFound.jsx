import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';

const NotFound = () => {
    return (
        <>
            <MainHeader />

            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white not-found-container">

                <div className="text-center p-5 bg-secondary bg-opacity-25 shadow-lg rounded-3 col-10 col-md-6">

                    <h1 className="not-found-title text-info fw-bolder mb-3">404</h1>

                    <h2 className="display-4 fw-light text-light mb-4">Page Not Found</h2>

                    <p className="lead mb-5">
                        Oops! It seems the page you were looking for doesn't exist. Let's guide you back to the light.
                    </p>

                    <Link to={'/'}>
                        <button className="btn btn-info btn-lg fw-bold">
                            <i className="bi bi-house-fill me-2"></i>
                            Go Back Home
                        </button>
                    </Link>
                </div>

            </div>
        </>
    );
}

export default NotFound;