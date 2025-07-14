import React from "react";
import { Link } from "react-router-dom";
import "./add-book.css";

export default function AddBookPage() {
  return (
    <>
      <header>
        <div className="header-left">
          <strong>BookLoop</strong>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/addbook">Add Book</Link>
            <Link to="/search">Search Books</Link>
            <Link to="/history">My History</Link>
            <Link to="/borrowrequests">Borrow Requests</Link>
            <Link to="/exchangechat">Chat Section</Link>
            <Link to="/membership">Membership</Link>
          </nav>
        </div>
        <div className="header-right">
          <Link to="/notifications" className="icon-link" title="Notifications">
            🔔
          </Link>
          <Link to="/profile" className="icon-link" title="Profile">
            👤
          </Link>
        </div>
      </header>

      <div className="banner">
        <h1>Ready to Share Your Books?</h1>
        <p>Share your literary treasures with fellow readers.</p>
      </div>

      <div className="form-wrapper">
        <h2>Add Your Book to BookExchange</h2>
        <form>
          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="Enter book title" required />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input type="text" placeholder="Enter author's name" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Brief description..." rows="4"></textarea>
          </div>
          <div className="form-group">
            <label>Book Cover (URL)</label>
            <input type="url" placeholder="Paste image URL" />
          </div>
          <div className="form-group">
            <label>Condition</label>
            <select>
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Used</option>
            </select>
          </div>
          <div className="form-group">
            <label>Availability</label>
            <select>
              <option>Available</option>
              <option>Coming Soon</option>
            </select>
          </div>
          <button type="submit">Add Book</button>
        </form>

        <div className="tips">
          <p><strong>Tips for a Great Book Listing:</strong></p>
          <ul>
            <li>Clear Photos</li>
            <li>Accurate Description</li>
            <li>Set Expectations</li>
            <li>Timely Response</li>
          </ul>
        </div>
      </div>

      <footer>BookExchange &copy; 2025</footer>
    </>
  );
}
