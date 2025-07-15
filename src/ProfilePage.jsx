import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    since: "",
    booksShared: 0,
    membership: "",
  });

  useEffect(() => {
    const name = sessionStorage.getItem("userName") || "Guest";
    const email = sessionStorage.getItem("userEmail") || "unknown@example.com";
    const since = sessionStorage.getItem("memberSince") || "Unknown";
    const booksShared = sessionStorage.getItem("booksShared") || 0;
    const membership = sessionStorage.getItem("membershipStatus") || "Free";

    setProfileData({ name, email, since, booksShared, membership });
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bp-profile-container">
      <img
        src="https://i.pravatar.cc/100?img=12"
        alt="Profile"
        className="bp-profile-pic"
      />

      <h2>{profileData.name}</h2>
      <div className="bp-profile-badge">{profileData.membership} Member</div>

      <div className="bp-profile-info">
        <p><i className="fas fa-envelope"></i>{profileData.email}</p>
        <p><i className="fas fa-calendar-alt"></i>Member Since: {profileData.since}</p>
        <p><i className="fas fa-book"></i>Total Books Shared: {profileData.booksShared}</p>
        <p><i className="fas fa-star"></i>Status: <strong>{profileData.membership}</strong></p>
      </div>

      <button className="bp-logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}
