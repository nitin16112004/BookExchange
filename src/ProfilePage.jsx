import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    since: "",
    booksShared: 0,
    membership: "",
    avatar: "",
    location: "", // ✅ Added
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    location: "", // ✅ Added
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile from sessionStorage on mount
  useEffect(() => {
    const storedProfile = {
      name: sessionStorage.getItem("userName") || "Guest User",
      email: sessionStorage.getItem("userEmail") || "unknown@example.com",
      since: sessionStorage.getItem("memberSince") || "Unknown",
      booksShared: sessionStorage.getItem("booksShared") || 0,
      membership: sessionStorage.getItem("membershipStatus") || "Free",
      avatar: sessionStorage.getItem("userAvatar") || "",
      location: sessionStorage.getItem("userLocation") || "Not Provided", // ✅
    };
    setProfile(storedProfile);
    setEditData({
      name: storedProfile.name,
      email: storedProfile.email,
      location: storedProfile.location, // ✅
    });
    setAvatarPreview(storedProfile.avatar || null);
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditData({
        name: profile.name,
        email: profile.email,
        location: profile.location, // ✅
      });
      setAvatarPreview(profile.avatar || null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...profile,
      name: editData.name,
      email: editData.email,
      location: editData.location, // ✅
      avatar: avatarPreview || "",
    };

    setProfile(updatedProfile);
    setIsEditing(false);

    sessionStorage.setItem("userName", updatedProfile.name);
    sessionStorage.setItem("userEmail", updatedProfile.email);
    sessionStorage.setItem("userAvatar", updatedProfile.avatar);
    sessionStorage.setItem("userLocation", updatedProfile.location); // ✅
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <img
            src={avatarPreview || "https://i.pravatar.cc/150?img=12"}
            alt="Profile Avatar"
            className="profile-avatar"
          />
          {isEditing && (
            <div className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                id="avatarInput"
                style={{ display: "none" }}
              />
              <label htmlFor="avatarInput" className="avatar-upload-btn">
                Change Photo
              </label>
            </div>
          )}
        </div>

        {!isEditing ? (
          <>
            <h2 className="profile-name">{profile.name}</h2>
            <span className={`profile-badge membership-${profile.membership.toLowerCase()}`}>
              {profile.membership} Member
            </span>

            <div className="profile-info">
              <p><i className="fas fa-envelope"></i> {profile.email}</p>
              <p><i className="fas fa-map-marker-alt"></i> Location: {profile.location}</p> {/* ✅ */}
              <p><i className="fas fa-calendar-alt"></i> Member Since: {profile.since}</p>
              <p><i className="fas fa-book"></i> Books Shared: {profile.booksShared}</p>
              <p><i className="fas fa-star"></i> Status: <strong>{profile.membership}</strong></p>
            </div>

            <div className="profile-buttons">
              <button className="btn btn-edit" onClick={toggleEdit}>Edit Profile</button>
              <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={handleSave}>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleChange}
                required
              />
            </label>

            <div className="profile-buttons">
              <button type="submit" className="btn btn-save">Save Changes</button>
              <button type="button" className="btn btn-cancel" onClick={toggleEdit}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
