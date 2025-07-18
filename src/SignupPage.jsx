import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  // State for signup form data including location
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Optionally: password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ✅ Save login state
    sessionStorage.setItem("isLoggedIn", "true");

    // ✅ Save user data with location (optional)
    sessionStorage.setItem("user", JSON.stringify(formData));

    // ✅ Navigate to homepage
    navigate("/");
  };

  return (
    <div className="bp-signup-page">
      <div className="bp-signup-left"></div>
      <div className="bp-signup-right">
        <div className="bp-signup-form-container">
          <h2>Create an Account</h2>
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
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
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
              placeholder="Enter your City or Pincode"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
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
