import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { booksAPI } from "./services/api.js";
import "./add-book.css";

export default function AddBookPage() {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
    condition: "New",
    availability: "Available",
    location: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userLocation = sessionStorage.getItem("userLocation") || "";
    setBookData((prev) => ({ ...prev, location: userLocation }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
    setSuccess(""); // Clear success message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate price
    if (!bookData.price || isNaN(bookData.price) || Number(bookData.price) <= 0) {
      setError("Please enter a valid price.");
      setLoading(false);
      return;
    }

    try {
      // Convert price to number
      const bookDataToSubmit = {
        ...bookData,
        price: Number(bookData.price)
      };

      await booksAPI.addBook(bookDataToSubmit);
      setSuccess(`Book "${bookData.title}" added successfully!`);
      
      // Reset form after successful submission
      setTimeout(() => {
        setBookData({
          title: "",
          author: "",
          description: "",
          imageUrl: "",
          condition: "New",
          availability: "Available",
          location: sessionStorage.getItem("userLocation") || "",
          price: "",
        });
        setSuccess("");
        navigate("/search"); // Redirect to search page to see the added book
      }, 2000);

    } catch (err) {
      setError(err.message || "Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="ab-header">
        <div className="ab-header-left">
          <strong>BookLoop</strong>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/addbook">Add Book</Link>
            <Link to="/search">Search Books</Link>
            <Link to="/history">My History</Link>
            <Link to="/borrowrequests">Borrow Requests</Link>
            <Link to="/exchangechat">Chat Section</Link>
          </nav>
        </div>
        <div className="ab-header-right">
          <Link to="/notifications" className="ab-icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="ab-icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="ab-banner">
        <h1>Ready to Share Your Books?</h1>
        <p>Share your literary treasures with fellow readers.</p>
      </div>

      <div className="ab-form-wrapper">
        <h2>Add Your Book to BookExchange</h2>
        
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

        {success && (
          <div style={{ 
            color: '#22c55e', 
            backgroundColor: '#e6ffe6', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="ab-form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter book title"
              value={bookData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ab-form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              placeholder="Enter author's name"
              value={bookData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ab-form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Brief description of the book..."
              rows="4"
              value={bookData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="ab-form-group">
            <label>Book Cover (URL)</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="Paste image URL (optional)"
              value={bookData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="ab-form-group">
            <label>Condition *</label>
            <select
              name="condition"
              value={bookData.condition}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="ab-form-group">
            <label>Availability</label>
            <select
              name="availability"
              value={bookData.availability}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          <div className="ab-form-group">
            <label>Rental Price (₹) *</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price for borrowing (per week)"
              value={bookData.price}
              onChange={handleChange}
              min="1"
              step="1"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Suggested price range: ₹20-₹100 per week depending on book value
            </small>
          </div>

          <div className="ab-form-group">
            <label>Your Location</label>
            <input
              type="text"
              name="location"
              value={bookData.location}
              onChange={handleChange}
              placeholder="Enter your city/area"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>

        <div className="ab-tips">
          <p><strong>Tips for a Great Book Listing:</strong></p>
          <ul>
            <li>Use clear, high-quality book cover images</li>
            <li>Write honest descriptions about book condition</li>
            <li>Set fair pricing based on book condition and demand</li>
            <li>Respond promptly to borrower requests</li>
            <li>Keep your location information updated</li>
          </ul>
        </div>
      </div>

      <footer>BookExchange © 2025</footer>
    </>
  );
}