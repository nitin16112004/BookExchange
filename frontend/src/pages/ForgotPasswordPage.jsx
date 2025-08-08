import React from "react";
import "./forgot.css"; // optional: style as needed

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email!");
  };

  return (
    <div className="fp-container">
      <div className="fp-box">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email@example.com" required />
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}
