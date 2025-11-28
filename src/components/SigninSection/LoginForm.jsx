import SigninButton from "./SigninButton";
import ErrorMessage from "../Messages/ErrorMessage";

const LoginForm = ({ username, setUsername, password, setPassword, isLoggingIn, handleLogin, isLoginErrorVisible }) => (
    <form className="w-100" style={{ maxWidth: '380px' }} onSubmit={handleLogin}>

        <ErrorMessage
            isVisible={isLoginErrorVisible}
            message="Invalid username or password. Please try again."
        />

        <div className="mb-3">
            <label htmlFor="username" className="visually-hidden">Username</label>
            <input
                id="username"
                name="username"
                type="text"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn}
            />
        </div>
        <div className="mb-4">
            <label htmlFor="password" className="visually-hidden">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control rounded-3 shadow-sm py-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
            />
        </div>

        <SigninButton isLoggingIn={isLoggingIn} />
    </form>
);

export default LoginForm;