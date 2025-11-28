import { useState, useEffect, useRef } from 'react';
import ImdbLogo from './ImdbLogo';
import SearchBar from './SearchBar';
import NavButton from './NavButton';
import { getToken, isTokenValid, getUserName } from '../../utils/tokenHelper';

const DROPDOWN_OPTIONS = [
    { "option": "Your Profile", "url": "/profile" },
    { "option": "Your Activity", "url": "/activity" },
    { "option": "Your Watchlist", "url": "/watchlist" },
    { "option": "Ratings", "url": "/ratings" },
    { "option": "Sign out", "url": "/signout" },
]

const LANGUAGE_OPTIONS = [
    { "option": "English", "url": "#" },
    { "option": "Spanish", "url": "#" },
    { "option": "Croatian", "url": "#" },
    { "option": "Vietnamese", "url": "#" },
]

const MainHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = getToken();
        const valid = isTokenValid(token);

        setIsLoggedIn(valid);

        if (valid) {
            setUserName(getUserName(token));
        }
    }, []); // ✅ Runs only once on mount

    return (
        <nav
            className="navbar navbar-expand-lg px-4 py-2"
            style={{ backgroundColor: '#121212', width: '100%' }}
        >
            <div className="container d-flex align-items-center justify-content-between p-0">

                <div className="d-flex align-items-center">
                    <ImdbLogo />
                </div>

                <div className="d-flex flex-grow-1 justify-content-center mx-3">
                    <SearchBar />
                </div>

                <div className="d-flex align-items-center gap-1">
                    <NavButton icon="bi-bookmark-plus-fill" label="Watchlist" location={"/watchlist"} />
                    <div className="vr bg-secondary mx-2" style={{ height: '20px' }}></div>
                    {isLoggedIn ? (
                        <NavButton
                            icon="bi-person-circle"
                            label={userName}
                            dropdownOptions={DROPDOWN_OPTIONS}
                        />
                    ) : (
                        <NavButton label="Sign In" location={"/signin"} />
                    )}
                    <NavButton
                        label="EN"
                        dropdownOptions={LANGUAGE_OPTIONS}
                    />
                </div>
            </div>
        </nav>
    );
};

export default MainHeader;