import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, authAPI } from "./services/api.js";
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
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    location: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Load profile from backend on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await userAPI.getProfile();
      
      const formattedProfile = {
        name: userData.name,
        email: userData.email,
        since: new Date(userData.memberSince).getFullYear(),
        booksShared: userData.booksShared,
        membership: userData.membershipStatus,
        avatar: userData.avatar || "",
        location: userData.location,
      };

      setProfile(formattedProfile);
      setEditData({
        name: formattedProfile.name,
        email: formattedProfile.email,
        location: formattedProfile.location,
      });
      setAvatarPreview(formattedProfile.avatar || null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile. Please try again.");
      
      // Fallback to sessionStorage if API fails
      const fallbackProfile = {
        name: sessionStorage.getItem("userName") || "Guest User",
        email: sessionStorage.getItem("userEmail") || "unknown@example.com",
        since: sessionStorage.getItem("memberSince") || "2025",
        booksShared: sessionStorage.getItem("booksShared") || 0,
        membership: sessionStorage.getItem("membershipStatus") || "Free",
        avatar: sessionStorage.getItem("userAvatar") || "",
        location: sessionStorage.getItem("userLocation") || "Not Provided",
      };
      setProfile(fallbackProfile);
      setEditData({
        name: fallbackProfile.name,
        email: fallbackProfile.email,
        location: fallbackProfile.location,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    
    if (isEditing) {
      // Reset form data if canceling
      setEditData({
        name: profile.name,
        email: profile.email,
        location: profile.location,
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate required fields
      if (!editData.name.trim() || !editData.location.trim()) {
        throw new Error("Name and location are required");
      }

      const profileData = {
        name: editData.name.trim(),
        email: editData.email.trim(),
        location: editData.location.trim(),
        avatar: avatarPreview || "",
      };

      await userAPI.updateProfile(profileData);

      // Update local state
      setProfile({
        ...profile,
        ...profileData,
      });
      
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authAPI.logout();
      navigate("/login");
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {error && (
          <div style={{
            color: '#ff4444',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '1rem',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: '#22c55e',
            backgroundColor: '#e6ffe6',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '1rem',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

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
              <p><i className="fas fa-map-marker-alt"></i> Location: {profile.location}</p>
              <p><i className="fas fa-calendar-alt"></i> Member Since: {profile.since}</p>
              <p><i className="fas fa-book"></i> Books Shared: {profile.booksShared}</p>
              <p><i className="fas fa-star"></i> Status: <strong>{profile.membership}</strong></p>
            </div>

            <div className="profile-buttons">
              <button className="btn btn-edit" onClick={toggleEdit}>
                Edit Profile
              </button>
              <button className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={handleSave}>
            <label>
              Name *
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                required
                maxLength={50}
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location *
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="City, State"
              />
            </label>

            <div className="profile-buttons">
              <button 
                type="submit" 
                className="btn btn-save"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="btn btn-cancel" 
                onClick={toggleEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}