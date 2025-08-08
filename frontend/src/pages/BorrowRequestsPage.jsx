import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./borrow-requests.css";

export default function BorrowRequestsPage() {
  const [activeTab, setActiveTab] = useState("incoming");

  return (
    <>
      <header className="br-header">
        <div className="br-header-left">
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
        <div className="br-header-right">
          <Link to="/notifications" className="br-icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="br-icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="br-container">
        <div className="br-tabs">
          <button
            className={`br-tab-btn ${activeTab === "incoming" ? "br-active" : ""}`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests
          </button>
          <button
            className={`br-tab-btn ${activeTab === "outgoing" ? "br-active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing Requests
          </button>
        </div>

        {activeTab === "incoming" && (
          <div className="br-main-content">
            <div className="br-left-panel">
              <div className="br-request br-selected">
                <img src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg" alt="Wanderlust" />
                <div className="br-request-details">
                  <h4>Wanderlust Chronicles</h4>
                  <p>From: Explorer Nomad</p>
                  <span className="br-tag br-pending">Pending</span>
                  <span className="br-time">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="br-right-panel">
              <div className="br-book-preview">
                <img src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg" alt="Wanderlust" />
                <div>
                  <h3>Wanderlust Chronicles</h3>
                  <p><strong>Explorer Nomad</strong></p>
                  <p>A classic tale of a shepherd boy named Santiago who journeys to the Egyptian desert in search of a hidden treasure. Through his travels, he learns valuable lessons about destiny, love, and the true meaning of life’s journey.</p>
                  <p><span className="br-genre">Genre:</span> Adventure, Philosophy</p>
                </div>
              </div>

              <div className="br-message-box">
                <div className="br-user-info">
                  <div className="br-avatar">AJ</div>
                  <div>
                    <strong>Alice Johnson</strong><br />
                    <small>Requester</small>
                  </div>
                </div>
                <p><strong>Request Message:</strong></p>
                <p>Hello! I’m very interested in borrowing “The Alchemist”...</p>
                <p className="br-timestamp">Sent on July 26, 2024, 10:30 AM</p>
                <div className="br-actions">
                  <button className="br-reject">Reject</button>
                  <button className="br-accept">Accept</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "outgoing" && (
          <div className="br-main-content">
            <p style={{ padding: "2rem" }}>No outgoing requests yet.</p>
          </div>
        )}
      </div>

      <footer className="br-footer">BookExchange © 2025 | Stay updated with BookExchange</footer>
    </>
  );
}
