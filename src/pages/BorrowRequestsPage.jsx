import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./borrow-requests.css";

export default function BorrowRequestsPage() {
  const [activeTab, setActiveTab] = useState("incoming");

  return (
    <>
      <header>
        <div className="header-left">
          <strong>BookLoop</strong>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/addbook">Add Book</Link>
            <Link to="/searchbooks">Search Books</Link>
            <Link to="/history">My History</Link>
            <Link to="/borrowrequests">Borrow Requests</Link>
            <Link to="/exchangechat">Chat Section</Link>
            <Link to="/membership">Membership</Link>
          </nav>
        </div>
        <div className="header-right">
          <Link to="/notifications" className="icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "incoming" ? "active" : ""}`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests
          </button>
          <button
            className={`tab-btn ${activeTab === "outgoing" ? "active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing Requests
          </button>
        </div>

        {activeTab === "incoming" && (
          <div className="main-content">
            <div className="left-panel">
              {/* Book Requests List */}
              <div className="request selected">
                <img src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg" alt="Wanderlust" />
                <div className="request-details">
                  <h4>Wanderlust Chronicles</h4>
                  <p>From: Explorer Nomad</p>
                  <span className="tag pending">Pending</span>
                  <span className="time">2 hours ago</span>
                </div>
              </div>
              {/* Add more requests here */}
            </div>

            <div className="right-panel">
              <div className="book-preview">
                <img src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg" alt="Wanderlust" />
                <div>
                  <h3>Wanderlust Chronicles</h3>
                  <p><strong>Explorer Nomad</strong></p>
                  <p>A classic tale of a shepherd boy...</p>
                  <p><span className="genre">Genre:</span> Adventure, Philosophy</p>
                </div>
              </div>
              <div className="message-box">
                <div className="user-info">
                  <div className="avatar">AJ</div>
                  <div>
                    <strong>Alice Johnson</strong><br />
                    <small>Requester</small>
                  </div>
                </div>
                <p><strong>Request Message:</strong></p>
                <p>Hello! I’m very interested in borrowing “The Alchemist”...</p>
                <p className="timestamp">Sent on July 26, 2024, 10:30 AM</p>
                <div className="actions">
                  <button className="reject">Reject</button>
                  <button className="accept">Accept</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "outgoing" && (
          <div className="main-content">
            <p style={{ padding: "2rem" }}>No outgoing requests yet.</p>
          </div>
        )}
      </div>

      <footer>BookExchange © 2025 | Stay updated with BookExchange</footer>
    </>
  );
}
