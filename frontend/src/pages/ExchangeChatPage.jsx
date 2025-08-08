import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { userAPI, booksAPI } from "../services/api.js";
import "./exchange-chat.css";

export default function ExchangeChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [book, setBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get parameters from URL
  const requestId = searchParams.get('requestId');
  const bookId = searchParams.get('bookId');
  const otherUserId = searchParams.get('userId');

  useEffect(() => {
    console.log("Chat component mounted with params:", { requestId, bookId, otherUserId });
    
    // Validate required parameters
    if (!requestId || !bookId || !otherUserId) {
      console.error("Missing required parameters");
      setLoading(false);
      setConnectionError(true);
      return;
    }

    initializeChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [requestId, bookId, otherUserId]);

  const initializeChat = async () => {
    try {
      console.log("Initializing chat...");
      setLoading(true);
      setConnectionError(false);

      // Get current user
      const currentUserData = await userAPI.getCurrentUser();
      console.log("Current user:", currentUserData);
      setCurrentUser(currentUserData);

      // Get other user details
      const otherUserData = await userAPI.getUserById(otherUserId);
      console.log("Other user:", otherUserData);
      setOtherUser(otherUserData);

      // Get book details
      const bookData = await booksAPI.getBookById(bookId);
      console.log("Book data:", bookData);
      setBook(bookData);

      // Initialize Socket.io connection
      initializeSocket(currentUserData._id);

      // Load existing messages
      await loadChatMessages();

      setLoading(false);
    } catch (error) {
      console.error("Error initializing chat:", error);
      setConnectionError(true);
      setLoading(false);
    }
  };

  const initializeSocket = (userId) => {
    try {
      console.log("Connecting to socket...");
      
      // Connect to socket with authentication
      socketRef.current = io('http://localhost:5000', {
        auth: {
          token: sessionStorage.getItem('authToken')
        },
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        
        // Join the chat room
        const roomId = `chat_${requestId}`;
        socketRef.current.emit('join_chat', {
          roomId: roomId,
          userId: userId,
          requestId: requestId
        });
        
        console.log(`Joined room: ${roomId}`);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionError(true);
      });

      socketRef.current.on('message_received', (message) => {
        console.log('New message received:', message);
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      socketRef.current.on('user_typing', (data) => {
        if (data.userId !== userId) {
          setTyping(true);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
          }, 2000);
        }
      });

      socketRef.current.on('user_stopped_typing', () => {
        setTyping(false);
      });

    } catch (error) {
      console.error("Error initializing socket:", error);
      setConnectionError(true);
    }
  };

  const loadChatMessages = async () => {
    try {
      console.log("Loading chat messages for request:", requestId);
      
      // API call to get existing messages
      const response = await fetch(`http://localhost:5000/api/chat/messages/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const chatMessages = await response.json();
        console.log("Loaded messages:", chatMessages);
        setMessages(chatMessages);
        scrollToBottom();
      } else {
        console.log("No existing messages found or error loading messages");
        // This is okay for new chats
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      // Set empty messages array if there's an error
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !socketRef.current || !currentUser) {
      return;
    }

    const messageData = {
      requestId: requestId,
      senderId: currentUser._id,
      senderName: currentUser.name,
      receiverId: otherUserId,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    try {
      console.log("Sending message:", messageData);
      
      // Emit message through socket
      socketRef.current.emit('send_message', messageData);
      
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, messageData]);
      setInputMessage("");
      scrollToBottom();
      
      // Save message to database
      await fetch('http://localhost:5000/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(messageData)
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Emit typing event
    if (socketRef.current) {
      socketRef.current.emit('typing', {
        requestId: requestId,
        userId: currentUser?._id
      });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <Link to="/borrow-requests" className="back-button">←</Link>
          <h2>Loading Chat...</h2>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Connecting to chat...</p>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (connectionError || !otherUser || !book || !currentUser) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <Link to="/borrow-requests" className="back-button">←</Link>
          <h2>Connection Error</h2>
        </div>
        <div className="error-state">
          <p>Unable to load chat. Please check:</p>
          <ul>
            <li>Your internet connection</li>
            <li>Backend server is running on port 5000</li>
            <li>You are logged in properly</li>
          </ul>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <Link to="/borrow-requests" className="back-button">←</Link>
        <div className="chat-user-info">
          <img 
            src={otherUser.avatar || "/default-avatar.png"} 
            alt={otherUser.name}
            className="user-avatar"
          />
          <div>
            <h3>{otherUser.name}</h3>
            <p className="book-title">{book.title}</p>
            {connectionError && <span className="connection-status offline">Offline</span>}
            {!connectionError && <span className="connection-status online">Online</span>}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Start your conversation about "{book.title}"</p>
            <p>You can discuss pickup location, timing, and other details here.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderId === currentUser._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.message}</p>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        
        {typing && (
          <div className="typing-indicator">
            <span>{otherUser.name} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="message-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn">📍 Share Location</button>
        <button className="quick-action-btn">📅 Schedule Meeting</button>
        <button className="quick-action-btn">📞 Call</button>
      </div>
    </div>
  );
}