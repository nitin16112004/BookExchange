import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // ✅ Set login session
    sessionStorage.setItem("isLoggedIn", "true");

    // ✅ Navigate to home
    navigate("/");
  };

  return (
    <div className="bp-signup-page">
      <div className="bp-signup-left"></div>
      <div className="bp-signup-right">
        <div className="bp-signup-form-container">
          <h2>Create an Account</h2>
          <form onSubmit={handleSignUp}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">Sign Up</button>
          </form>
          <div className="bp-signup-toggle">
            <p>Already have an account? <Link to="/login">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
