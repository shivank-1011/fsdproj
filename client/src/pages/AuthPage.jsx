import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import InteractiveBackground from "../components/InteractiveBackground";
import "./AuthPage.css";

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const isSignUp = location.pathname === "/register";

    // Store state
    const { login, register: registerUser, googleAuth, isLoading, error, clearError } = useAuthStore();

    // Form interactions
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER"); // Default to user
    const [showPassword, setShowPassword] = useState(false);

    const handleSwitch = (mode) => {
        // Clear errors and reset form when switching modes
        if (clearError) clearError();
        setEmail("");
        setPassword("");
        setName("");
        // Update URL to match state without reloading
        navigate(mode === "signup" ? "/register" : "/login", { replace: true });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/"); // Or previous location
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, password, name, role);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleAuth(credentialResponse.credential, role);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <InteractiveBackground />

            <div className={`auth-card ${isSignUp ? "right-panel-active" : ""}`}>

                {/* SIGN UP FORM CONTAINER (Register) */}
                <div className={`form-container sign-up-container ${isSignUp ? "mobile-show" : ""}`}>
                    <form onSubmit={handleRegisterSubmit}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Create Account</h1>

                        <div style={{ display: 'flex', width: '100%', gap: '15px', marginBottom: '15px' }}>
                            {/* Account Type Selection */}
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#403d39' }}>
                                    1.Account Type
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-input form-select"
                                    style={{ margin: '0', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', fontWeight: '450', width: '100%', height: '40px', padding: '0 10px', fontSize: '15px' }}
                                >
                                    <option value="USER">User</option>
                                    <option value="SELLER">Seller</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            {/* Google Sign Up */}
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#403d39' }}>
                                    2. Sign Up
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'center', height: '40px', alignItems: 'center' }}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => {
                                            console.error('Google Auth Failed');
                                        }}
                                        theme="outline"
                                        text="signup_with"
                                        shape="square"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                            <span style={{ padding: '0 10px', color: '#777', fontSize: '11px', fontWeight: 'bold' }}>OR USE EMAIL</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                        </div>

                        {error && isSignUp && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Name"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '15px' }}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "SIGN UP"}
                        </button>

                        {/* Mobile Toggle Button */}
                        <button
                            type="button"
                            className="forgot-password"
                            style={{ marginTop: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleSwitch("signin")}
                        >
                            Already have an account? Sign In
                        </button>
                    </form>
                </div>

                {/* SIGN IN FORM CONTAINER (Login) */}
                <div className={`form-container sign-in-container ${!isSignUp ? "mobile-show" : ""}`}>
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Sign In</h1>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '25px 0 15px 0' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.error('Google Auth Failed');
                                }}
                                theme="outline"
                                text="signin_with"
                            />
                        </div>

                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                            <span style={{ padding: '0 10px', color: '#777', fontSize: '12px', fontWeight: 'bold' }}>OR USE EMAIL</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                        </div>

                        {error && !isSignUp && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "SIGN IN"}
                        </button>

                        {/* Mobile Toggle Button */}
                        <button
                            type="button"
                            className="forgot-password"
                            style={{ marginTop: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleSwitch("signup")}
                        >
                            Don't have an account? Sign Up
                        </button>
                    </form>
                </div>

                {/* OVERLAY CONTAINER */}
                <div className="overlay-container">
                    <div className="overlay">
                        {/* LEFT OVERLAY PANEL (Visible when Sign Up form is shown) */}
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p className="welcome-text">
                                To keep connected with us please login with your personal info
                            </p>
                            <button
                                className="btn-ghost"
                                onClick={() => handleSwitch("signin")}
                            >
                                SIGN IN
                            </button>
                        </div>

                        {/* RIGHT OVERLAY PANEL (Visible when Sign In form is shown) */}
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, User</h1>
                            <p className="welcome-text">
                                Enter your personal details and start journey with us
                            </p>
                            <button
                                className="btn-ghost"
                                onClick={() => handleSwitch("signup")}
                            >
                                SIGN UP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
