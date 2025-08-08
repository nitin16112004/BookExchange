import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "./services/api.js";
import "./signup.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: ""
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = formData;
      await authAPI.signup(signupData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bp-signup-page">
      <div className="bp-signup-left"></div>
      <div className="bp-signup-right">
        <div className="bp-signup-form-container">
          <h2>Create an Account</h2>
          
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
            <Link to="/login" className="bp-login-switch-btn">
              Sign In
            </Link>
            <Link to="/signup" className="bp-login-switch-btn active">
              Sign Up
            </Link>
          </div>

          <form onSubmit={handleSignUp}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Enter your City or Area"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="bp-signup-toggle">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}