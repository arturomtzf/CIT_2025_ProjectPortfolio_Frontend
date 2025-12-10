import { useState, useEffect, useRef } from 'react';
import ImdbLogo from './ImdbLogo';
import SearchBar from './SearchBar';
import NavButton from './NavButton';
import { getToken, isTokenValid, getUserName } from '../../utils/tokenHelper';

const DROPDOWN_OPTIONS = [
    { "option": "Your Activity", "url": "/activity" },
    { "option": "Your Watchlist", "url": "/watchlist" },
    { "option": "Ratings", "url": "/ratings" },
    { "option": "Sign out", "url": "/signout" },
]

const GENRES_OPTIONS = [
    { "option": "Action", "url": "/titles?genre=Action" },
    { "option": "Adventure", "url": "/titles?genre=Adventure" },
    { "option": "Comedy", "url": "/titles?genre=Comedy" },
    { "option": "Drama", "url": "/titles?genre=Drama" },
    { "option": "Fantasy", "url": "/titles?genre=Fantasy" },
    { "option": "Horror", "url": "/titles?genre=Horror" },
    { "option": "Mystery", "url": "/titles?genre=Mystery" },
    { "option": "Romance", "url": "/titles?genre=Romance" },
    { "option": "Sci-Fi", "url": "/titles?genre=Sci-Fi" },
    { "option": "Thriller", "url": "/titles?genre=Thriller" },
    { "option": "Western", "url": "/titles?genre=Western" },
    { "option": "Animation", "url": "/titles?genre=Animation" },
    { "option": "Documentary", "url": "/titles?genre=Documentary" },
    { "option": "Family", "url": "/titles?genre=Family" },
    { "option": "History", "url": "/titles?genre=History" },
    { "option": "Music", "url": "/titles?genre=Music" },
    { "option": "War", "url": "/titles?genre=War" },
    { "option": "Sport", "url": "/titles?genre=Sport" },
    { "option": "Crime", "url": "/titles?genre=Crime" },
    { "option": "Biography", "url": "/titles?genre=Biography" },
    { "option": "Musical", "url": "/titles?genre=Musical" },
    { "option": "Short", "url": "/titles?genre=Short" },
    { "option": "Reality-TV", "url": "/titles?genre=Reality-TV" },
    { "option": "Talk-Show", "url": "/titles?genre=Talk-Show" },
    { "option": "Game-Show", "url": "/titles?genre=Game-Show" },
    { "option": "News", "url": "/titles?genre=News" },
    { "option": "Adult", "url": "/titles?genre=Adult" },
    { "option": "Other", "url": "/titles?genre=Other" },
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
    }, []);

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

                <div className="d-flex flex-grow-1 justify-content-center mx-3">
                    <NavButton label="Titles" dropdownOptions={GENRES_OPTIONS} />
                    <div className="vr bg-secondary mx-2" style={{ height: '20px' }}></div>
                </div>

                <div className="d-flex flex-grow-1 justify-content-center mx-3">
                    <NavButton label="Actors" location={'/actors'} />
                    <div className="vr bg-secondary mx-2" style={{ height: '20px' }}></div>
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