import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./forgot.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent!");
    navigate("/login");
  };

  return (
    <div className="fp-container">
      <h2 className="fp-heading">Reset Password</h2>
      <p className="fp-description">Enter your registered email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="fp-form">
        <input type="email" placeholder="Enter your email" required className="fp-input" />
        <button type="submit" className="fp-button">Send Reset Link</button>
      </form>
      <Link to="/login" className="fp-back-link">← Back to Sign In</Link>
    </div>
  );
}
