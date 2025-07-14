import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function HomePage() {
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
          <Link to="/signup" className="signup-button">Sign Up</Link>
          <Link to="/notifications" className="icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="overlay">
          <h1>Discover Your Next Great Read</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search for books by title, author or ISBN..." />
            <button>🔍</button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Featured & Trending Books</h2>
        <div className="book-grid">
          <div className="book">
            <img
              src="https://m.media-amazon.com/images/I/81IM6vEPvLL._UF1000,1000_QL80_.jpg"
              alt="The Crash"
            />
            <h4>The Crash</h4>
            <p>$12.00</p>
          </div>
          <div className="book">
            <img
              src="https://m.media-amazon.com/images/I/81Vcp2zthJL._AC_UF1000,1000_QL80_DpWeblab_.jpg"
              alt="Strangers in Time"
            />
            <h4>Strangers in Time</h4>
            <p>$15.00</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Personalized Recommendations</h2>
        <div className="book-grid">
          <div className="book">
            <img
              src="https://i0.wp.com/www.nationalbook.org/wp-content/uploads/2017/05/blood-in-the-water.jpg?fit=266%2C400&ssl=1"
              alt="Blood in the Water"
            />
            <h4>Blood in the Water</h4>
            <p>$9.99</p>
          </div>
          <div className="book">
            <img
              src="https://images3.penguinrandomhouse.com/cover/9798217071937"
              alt="The Listeners"
            />
            <h4>The Listeners</h4>
            <p>$11.00</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Explore by Genre</h2>
        <div className="genres">
          <div className="genre">Fiction</div>
          <div className="genre">Non-Fiction</div>
          <div className="genre">Science</div>
          <div className="genre">Romance</div>
          <div className="genre">Thriller</div>
        </div>
      </section>

      <section className="section">
        <h2>Bookish Insights</h2>
        <div className="insights">
          <div className="insight">
            <h4>Books Read This Month</h4>
            <p>12</p>
          </div>
          <div className="insight">
            <h4>Average Rating</h4>
            <p>4.5 / 5</p>
          </div>
          <div className="insight">
            <h4>Most Popular Genre</h4>
            <p>Fantasy</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Upcoming Releases & Events</h2>
        <div className="events">
          <div className="event">The Future of AI - Aug 2025</div>
          <div className="event">Sustainable Living Guide</div>
          <div className="event">Digital Photography Talk</div>
          <div className="event">Art of Storytelling Workshop</div>
        </div>
      </section>

      <footer>© 2025 BookBound Inc. | Made with ❤️</footer>
    </>
  );
}
