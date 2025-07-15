import React from "react";
import { Link } from "react-router-dom";
import "./my-history.css";

export default function MyHistoryPage() {
  return (
    <>
      <header className="mh-header">
        <div className="mh-header-left">
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
        <div className="mh-header-right">
          <Link to="/notifications" className="mh-icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="mh-icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="mh-container">
        <h1>My Book History</h1>

        {/* Stats Section */}
        <div className="mh-stats">
          <div className="mh-stat-box">
            <h2>35</h2>
            <p>Total Borrowed Books</p>
          </div>
          <div className="mh-stat-box">
            <h2>22</h2>
            <p>Total Lent Books</p>
          </div>
          <div className="mh-stat-box">
            <h2>3</h2>
            <p>Active Loans</p>
          </div>
        </div>

        {/* Borrowed Books Section */}
        <h2>Borrowed Books List</h2>
        <div className="mh-book-grid">
          <div className="mh-book-card">
            <img
              src="https://g.sdlcdn.com/imgs/k/r/l/Atomic-Habits-English-Paperback-by-SDL396648381-1-9177c.jpg"
              alt="Atomic Habits"
            />
            <div className="mh-tags">
              <span className="mh-tag">Borrowed</span>
              <span className="mh-tag">Self Help</span>
            </div>
          </div>
          <div className="mh-book-card">
            <img
              src="https://images-eu.ssl-images-amazon.com/images/I/617lxveUjYL._AC_UL210_SR210,210_.jpg"
              alt="The Alchemist"
            />
            <div className="mh-tags">
              <span className="mh-tag">Returned</span>
              <span className="mh-tag">Fiction</span>
            </div>
          </div>
        </div>

        {/* Last Books Section */}
        <h2>Last Books</h2>.
        <div className="mh-book-grid">
          <div className="mh-book-card">
            <img
              src="https://m.media-amazon.com/images/I/61i4k7DWNFL._UF1000,1000_QL80_.jpg"
              alt="Sapiens"
            />
            <div className="mh-tags">
              <span className="mh-tag">Returned</span>
              <span className="mh-tag">History</span>
            </div>
          </div>
          <div className="mh-book-card">
            <img
              src="https://images-eu.ssl-images-amazon.com/images/I/71-4MkLN5jL._AC_UL210_SR210,210_.jpg"
              alt="Educated"
            />
            <div className="mh-tags">
              <span className="mh-tag">Returned</span>
              <span className="mh-tag">Biography</span>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mh-activity-section">
          <h3>Recent Activity</h3>
          <ul>
            <li><span>You borrowed "Atomic Habits"</span> <span>June 22, 2025</span></li>
            <li><span>You returned "The Alchemist"</span> <span>June 20, 2025</span></li>
            <li><span>You borrowed "Sapiens"</span> <span>June 18, 2025</span></li>
            <li><span>You returned "Educated"</span> <span>June 15, 2025</span></li>
            <li><span>You borrowed "Becoming"</span> <span>June 12, 2025</span></li>
          </ul>
        </div>
      </div>

      <footer className="mh-footer">
        BookExchange © 2025 | Stay updated with BookExchange
      </footer>
    </>
  );
}
