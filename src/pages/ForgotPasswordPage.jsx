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
    <div className="forgot-container">
      <h2>Reset Password</h2>
      <p>Enter your registered email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      <Link to="/login" className="back-link">← Back to Sign In</Link>
    </div>
  );
}

