import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Save login status in localStorage
    sessionStorage.setItem("isLoggedIn", "true");

    // ✅ Redirect to homepage
    navigate("/");
  };

  return (
    <div className="bp-login-page">
      <div className="bp-login-left"></div>
      <div className="bp-login-right">
        <div className="bp-login-form-container">
          <h2>Welcome to BookLoop!</h2>
          <p className="bp-login-subtext">Join our community of readers!</p>

          <div className="bp-login-switch-buttons">
            <Link to="/login" className="bp-login-switch-btn active">
              Sign In
            </Link>
            <Link to="/signup" className="bp-login-switch-btn">
              Sign Up
            </Link>
          </div>

          <form onSubmit={handleLogin}>
            <input type="email" placeholder="email@example.com" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign in</button>
          </form>


<div className="bp-login-skip-btn">
  <button
    type="button"
    className="bp-skip-btn"
    onClick={() => {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userRole", "guest");
      navigate("/");
    }}
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
