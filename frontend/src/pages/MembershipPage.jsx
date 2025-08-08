import React from "react";
import { Link } from "react-router-dom";
import "./membership.css";

export default function MembershipPage() {
  return (
    <>
      <header className="membership-header">
        <div className="membership-header-left">
          <strong>BookLoop</strong>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/addbook">Add Book</Link>
            <Link to="/search">Search Books</Link>
            <Link to="/myhistory">My History</Link>
            <Link to="/borrowrequests">Borrow Requests</Link>
            <Link to="/exchangechat">Chat Section</Link>
            <Link to="/membership">Membership</Link>
          </nav>
        </div>
        <div className="membership-header-right">
          <Link to="/notifications" className="icon-link" title="Notifications">
            🔔
          </Link>
          <Link to="/profile" className="icon-link" title="Profile">
            👤
          </Link>
        </div>
      </header>

      <div className="membership-container">
        <div className="membership-status-box">
          <h2>Your Membership Status</h2>
          <h2 style={{ color: "#d946ef" }}>Premium Member</h2>
          <p>
            Enjoy unlimited book access and priority service as a premium member of the
            BookExchange community.
          </p>
          <button>Manage Subscription</button>
        </div>

        <div className="membership-benefits">
          <h3>Explore Your Premium Benefits</h3>
          <ul>
            <li>✅ Unlimited book borrow with no limits</li>
            <li>✅ Early access to new listings</li>
            <li>✅ Dedicated support for all your questions</li>
            <li>✅ Exclusive booklists by community experts</li>
            <li>✅ Access to premium-only book collections</li>
          </ul>
        </div>

        <div className="membership-faq">
          <h3>Frequently Asked Questions</h3>
          <h4>How do I upgrade or change my membership?</h4>
          <p>You can manage your subscription from your profile page or click the button above.</p>

          <h4>What happens if I cancel my premium membership?</h4>
          <p>Your benefits will remain active till the billing cycle ends.</p>

          <h4>Is there a free trial for premium membership?</h4>
          <p>Yes! You get 7 days full access free trial when you first join.</p>

          <h4>What are the key differences between Free and Premium tiers?</h4>
          <p>Premium users get unlimited borrowing, early access, and no ads.</p>

          <h4>Can I pause my membership?</h4>
          <p>Yes, from your settings you can pause or resume anytime.</p>
        </div>
      </div>

      <footer className="membership-footer">BookExchange © 2025 | Stay updated with BookExchange</footer>
    </>
  );
}
