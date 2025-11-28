import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';

const NotFound = () => {
    return (
        <div>
            <MainHeader />
            <h1>Not Found Page</h1>
            <h2>Hay que hacerla bonita</h2>
            <Link to={'/'}>
                <button>Go back Home</button>
            </Link>
        </div>
    );
}

export default NotFound;