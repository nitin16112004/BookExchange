import React from "react";
import "./NotificationPage.css";

export default function NotificationPage() {
  return (
    <div className="bp-notification-container">
      <h1 className="bp-notification-title">Your Notifications</h1>

      <div className="bp-notification-box">
        🔔 Your request to borrow <strong>The Crash</strong> was approved!
      </div>
      <div className="bp-notification-box">
        🔔 New book <strong>Digital Fortress</strong> added to your favorite genre.
      </div>
      <div className="bp-notification-box">
        🔔 You have a new message in the Chat Section.
      </div>
    </div>
  );
}
