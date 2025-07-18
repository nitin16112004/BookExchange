import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./add-book.css";

export default function AddBookPage() {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
    condition: "New",
    availability: "Available",
    location: "",
    price: "", // ✅ added price
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate price
    if (!bookData.price || isNaN(bookData.price) || Number(bookData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    // Log book data (mock backend save)
    console.log("Book submitted:", bookData);
    alert(`Book "${bookData.title}" added successfully with ₹${bookData.price} fee!`);
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
        <form onSubmit={handleSubmit}>
          <div className="ab-form-group">
            <label>Title</label>
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
            <label>Author</label>
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
              placeholder="Brief description..."
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
              placeholder="Paste image URL"
              value={bookData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="ab-form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={bookData.condition}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Used</option>
            </select>
          </div>

          <div className="ab-form-group">
            <label>Availability</label>
            <select
              name="availability"
              value={bookData.availability}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>Coming Soon</option>
            </select>
          </div>

          <div className="ab-form-group">
            <label>Set Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price for borrowing"
              value={bookData.price}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="ab-form-group">
            <label>Your Location</label>
            <input
              type="text"
              name="location"
              value={bookData.location}
              readOnly
              disabled
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </div>

          <button type="submit">Add Book</button>
        </form>

        <div className="ab-tips">
          <p><strong>Tips for a Great Book Listing:</strong></p>
          <ul>
            <li>Clear Photos</li>
            <li>Accurate Description</li>
            <li>Set Expectations</li>
            <li>Timely Response</li>
          </ul>
        </div>
      </div>

      <footer>BookExchange © 2025</footer>
    </>
  );
}
