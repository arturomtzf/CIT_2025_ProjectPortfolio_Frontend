import { useState } from 'react';
import BenefitList from './BenefitsList';
import LoginForm from './LoginForm';
import RegisterSection from './RegisterSection';
import { setToken } from '../../utils/tokenHelper';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function SigninSection() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoginErrorVisible, setIsLoginErrorVisible] = useState(false);
    const navigate = useNavigate();

    const loginEvent = async (credentials) => {
        if (!API_URL) {
            // setIsLoggingIn(false);
            console.warn("API_URL not defined. Using mock data.");
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                body: JSON.stringify(credentials),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();

            // Successful login
            setToken(data.token);
            navigate("/");
        } catch (error) {
            setIsLoginErrorVisible(true);
            console.error("Error when loggin in: " + error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        await loginEvent({ username, password })

        setIsLoggingIn(false);
    };

    return (
        <div className="min-vh-100 bg-white d-flex justify-content-center pt-5 pb-5 px-3">
            <div className="container" style={{ maxWidth: '960px' }}>
                <div className="row justify-content-center">

                    <div className="col-12 col-md-6 d-flex flex-column align-items-start" style={{ gap: '2rem', marginBottom: '3rem' }}>
                        <h2
                            className="fs-4 fw-bold text-dark ps-3"
                            style={{ borderLeft: '4px solid #f5c518' }}
                        >
                            Sign in
                        </h2>

                        <LoginForm
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            isLoggingIn={isLoggingIn}
                            handleLogin={handleLogin}
                            isLoginErrorVisible={isLoginErrorVisible}
                        />

                        <RegisterSection />
                    </div>

                    <div className="col-12 col-md-6">
                        <BenefitList />
                    </div>

                </div>
            </div>
        </div>
    );
}