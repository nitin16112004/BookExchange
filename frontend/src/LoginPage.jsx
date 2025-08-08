import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "./services/api.js";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authAPI.login(formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userRole", "guest");
    navigate("/");
  };

  return (
    <div className="bp-login-page">
      <div className="bp-login-left"></div>
      <div className="bp-login-right">
        <div className="bp-login-form-container">
          <h2>Welcome to BookLoop!</h2>
          <p className="bp-login-subtext">Join our community of readers!</p>

          {error && (
            <div style={{ 
              color: '#ff4444', 
              backgroundColor: '#ffe6e6', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '1rem',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="bp-login-switch-buttons">
            <Link to="/login" className="bp-login-switch-btn active">
              Sign In
            </Link>
            <Link to="/signup" className="bp-login-switch-btn">
              Sign Up
            </Link>
          </div>

          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="bp-login-skip-btn">
            <button
              type="button"
              className="bp-skip-btn"
              onClick={handleSkip}
            >
              Skip for now
            </button>
          </div>
          
          <div className="bp-login-toggle">
            <Link to="/forgot">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}