import React, { useState } from "react";
import "./exchange-chat.css";
import { Link } from "react-router-dom";

export default function ExchangeChatPage() {
  const [messages, setMessages] = useState([
    { text: "Hi Alex! Thanks for accepting my request...", time: "10:05 AM", sender: "other" },
    { text: "Hey Alice! I'm free Wednesday evening or Saturday morning.", time: "10:10 AM", sender: "self" },
    { text: "How about 10 AM at the 'Central Park Cafe'?", time: "10:15 AM", sender: "other" },
    { text: "Perfect! See you at 10 AM Saturday at Central Park Cafe.", time: "10:20 AM", sender: "self" },
    { text: "Looking forward to it!", time: "10:25 AM", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages([...messages, { text: newMessage, time, sender: "self" }]);
    setNewMessage("");
  };

  return (
    <>
      <header className="ec-header">
        <div className="ec-header-left">
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
        <div className="ec-header-right">
          <Link to="/notifications" className="ec-icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="ec-icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <main className="ec-container">
        <aside className="ec-sidebar">
          <h3>How to Coordinate Your Book Exchange</h3>
          <ul>
            <li>📞 Reach out after accepting</li>
            <li>📍 Choose a public location</li>
            <li>🕒 Pick a time/date that works</li>
            <li>✅ Confirm details to avoid issues</li>
            <li>📖 Meet and exchange book</li>
            <li>📦 Mark as exchanged</li>
          </ul>
          <div className="ec-borrower-box">
            <h4>Borrower Info</h4>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT0ZnUKa5MS1tglmhU1JhkW3SxexchRBo6SA&s"
              alt="Sarah"
              className="ec-avatar"
            />
            <p><strong>Alice Johnson</strong></p>
            <p>📧 alice.c@example.com</p>
            <p>📞 +1 (555) 123-4567</p>
          </div>
        </aside>

        <section className="ec-chat-area">
          <h2>Exchange Coordination Chat</h2>

          <div id="chat-box" className="ec-chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`ec-msg ${msg.sender}`}>
                {msg.text} <span>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="ec-input-box">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>

          <div className="ec-meeting-box">
            <h4>📅 Exchange Meeting Confirmed</h4>
            <p><strong>Saturday, July 27, 2024</strong></p>
            <p>10:00 AM – 10:30 AM</p>
            <p>📍 Central Park Cafe</p>
          </div>
        </section>
      </main>

      <footer>© 2025 BookLoop | Exchange made easy</footer>
    </>
  );
}
