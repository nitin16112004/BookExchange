import React from "react";
import { Link } from "react-router-dom";
import "./my-history.css";

export default function MyHistoryPage() {
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
          <Link to="/notifications" className="icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="container">
        <h1>My Book History</h1>

        <div className="stats">
          <div className="stat-box">
            <h2>35</h2>
            <p>Total Borrowed Books</p>
          </div>
          <div className="stat-box">
            <h2>22</h2>
            <p>Total Lent Books</p>
          </div>
          <div className="stat-box">
            <h2>3</h2>
            <p>Active Loans</p>
          </div>
        </div>

        <h2>Borrowed Books List</h2>
        <div className="book-grid">
          <div className="book-card">
            <img
              src="https://g.sdlcdn.com/imgs/k/r/l/Atomic-Habits-English-Paperback-by-SDL396648381-1-9177c.jpg"
              alt="Atomic Habits"
            />
            <div className="tags">
              <span className="tag">Borrowed</span>
              <span className="tag">Self Help</span>
            </div>
          </div>
          <div className="book-card">
            <img
              src="https://images-eu.ssl-images-amazon.com/images/I/617lxveUjYL._AC_UL210_SR210,210_.jpg"
              alt="The Alchemist"
            />
            <div className="tags">
              <span className="tag">Returned</span>
              <span className="tag">Fiction</span>
            </div>
          </div>
        </div>

        <h2>Last Books</h2>
        <div className="book-grid">
          <div className="book-card">
            <img
              src="https://m.media-amazon.com/images/I/61i4k7DWNFL._UF1000,1000_QL80_.jpg"
              alt="Sapiens"
            />
            <div className="tags">
              <span className="tag">Returned</span>
              <span className="tag">History</span>
            </div>
          </div>
          <div className="book-card">
            <img
              src="https://images-eu.ssl-images-amazon.com/images/I/71-4MkLN5jL._AC_UL210_SR210,210_.jpg"
              alt="Educated"
            />
            <div className="tags">
              <span className="tag">Returned</span>
              <span className="tag">Biography</span>
            </div>
          </div>
        </div>

        <div className="activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>
              <span>You borrowed "Atomic Habits"</span>{" "}
              <span>June 22, 2025</span>
            </li>
            <li>
              <span>You returned "The Alchemist"</span>{" "}
              <span>June 20, 2025</span>
            </li>
            <li>
              <span>You borrowed "Sapiens"</span> <span>June 18, 2025</span>
            </li>
            <li>
              <span>You returned "Educated"</span> <span>June 15, 2025</span>
            </li>
            <li>
              <span>You borrowed "Becoming"</span> <span>June 12, 2025</span>
            </li>
          </ul>
        </div>
      </div>

      <footer>
        BookExchange © 2025 | Stay updated with BookExchange
      </footer>
    </>
  );
}
