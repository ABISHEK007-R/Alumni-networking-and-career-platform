import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearAuthStorage } from "../auth/storage";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    clearAuthStorage();

    try {
      const response = await api.post("/auth/login", { email, password });
      const authenticatedUser = response.data;

      if (!authenticatedUser?.token) {
        throw new Error("Login succeeded without a JWT token.");
      }

      localStorage.setItem("authToken", authenticatedUser.token);
      localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
      localStorage.setItem("alumniUser", JSON.stringify(authenticatedUser));

      navigate(authenticatedUser.role === "ALUMNI" ? "/alumni/dashboard" : "/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to login. Check your email and password.");
    }
  };

  return (
    <div className="auth-page login-page">
      <section className="auth-hero" aria-label="Alumni Connect AI benefits">
        <div className="auth-hero-glow auth-hero-glow-one" />
        <div className="auth-hero-glow auth-hero-glow-two" />
        <div className="auth-brand"><span className="auth-brand-mark">AC</span><span>Alumni Connect <b>AI</b></span></div>
        <div className="auth-hero-copy">
          <p className="auth-kicker">Your next opportunity starts here</p>
          <h1>Build a career with people who have been there.</h1>
          <p>Connect with alumni mentors, discover meaningful opportunities, and get practical AI-powered guidance for every step ahead.</p>
          <div className="auth-benefits">
            <span>Connect with alumni mentors</span>
            <span>Discover internship opportunities</span>
            <span>Get AI-powered career guidance</span>
          </div>
        </div>
        <div className="auth-network-card auth-network-card-main"><span className="network-pulse" /><strong>Career network</strong><small>18,000+ alumni connections</small></div>
        <div className="auth-network-card auth-network-card-small"><span>✦</span><strong>AI guidance</strong><small>Personalized for you</small></div>
        <div className="auth-network-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-kicker">Welcome back</p>
            <h2>Sign in to continue</h2>
            <p>Continue your career journey with Alumni Connect AI.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
          {message && <p className="success-banner" role="status">{message}</p>}
          {error && <p className="error-banner" role="alert">{error}</p>}
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap"><span aria-hidden="true">@</span>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrap"><span aria-hidden="true">●</span>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
          </div>

          <div className="auth-form-meta"><label><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot-password">Forgot password?</a></div>
          <button type="submit" className="auth-submit">Sign in <span aria-hidden="true">→</span></button>
        </form>

          <div className="auth-switch"><span>Don't have an account?</span><button type="button" onClick={() => navigate("/register")}>Create account</button></div>
        </div>
        <p className="auth-legal">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
      </main>
    </div>
  );
};

export default Login;