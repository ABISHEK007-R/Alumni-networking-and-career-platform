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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
          }}
        >
          Alumni Connect AI
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          AI-Powered Alumni Career & Networking Platform
        </p>

        <form onSubmit={handleSubmit}>
          {message && <p className="success-banner" role="status">{message}</p>}
          {error && <p className="error-banner" role="alert">{error}</p>}
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <p>Don't have an account?</p>

<button
  onClick={() => navigate("/register")}
  style={{
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Register
</button>
        </div>
      </div>
    </div>
  );
};

export default Login;