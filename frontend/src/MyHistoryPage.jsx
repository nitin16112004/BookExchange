import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionsAPI, booksAPI, userAPI } from "./services/api.js";
import "./my-history.css";

export default function MyHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    totalLent: 0,
    activeLoans: 0,
    totalEarned: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("borrowed");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Check if user is authenticated
      const authToken = sessionStorage.getItem('authToken');
      const userId = sessionStorage.getItem('userId');
      
      if (!authToken || !userId) {
        // Guest user - show empty state
        setStats({
          totalBorrowed: 0,
          totalLent: 0,
          activeLoans: 0,
          totalEarned: 0
        });
        setTransactions([]);
        setUserBooks([]);
        setLoading(false);
        return;
      }

      // Create promises for parallel API calls
      const promises = [];
      
      // 1. Get user transactions - use the correct API function
      promises.push(
        transactionsAPI.getUserTransactions()
          .then(data => {
            // Handle different response formats
            if (data.borrowed && data.lent) {
              // If API returns structured data
              const allTransactions = [...(data.borrowed || []), ...(data.lent || [])];
              setTransactions(allTransactions);
              
              // Use provided stats if available
              if (data.stats) {
                setStats(data.stats);
              } else {
                // Calculate stats manually
                calculateStats(data.borrowed || [], data.lent || [], userId);
              }
            } else if (Array.isArray(data)) {
              // If API returns array of transactions
              setTransactions(data);
              calculateStatsFromArray(data, userId);
            } else {
              // Fallback - empty data
              setTransactions([]);
              setStats({
                totalBorrowed: 0,
                totalLent: 0,
                activeLoans: 0,
                totalEarned: 0
              });
            }
          })
          .catch(err => {
            console.error("Transaction API error:", err);
            // Set empty data on error
            setTransactions([]);
          })
      );
      
      // 2. Get user's books - use the correct API function
      promises.push(
        booksAPI.getUserBooks()
          .then(books => {
            setUserBooks(Array.isArray(books) ? books : []);
          })
          .catch(err => {
            console.error("Books API error:", err);
            setUserBooks([]);
          })
      );

      // Wait for all promises to complete
      await Promise.all(promises);
      
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setError("Failed to load history. Using offline mode.");
      
      // Set empty data on error
      setTransactions([]);
      setUserBooks([]);
      setStats({
        totalBorrowed: 0,
        totalLent: 0,
        activeLoans: 0,
        totalEarned: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate stats from structured data
  const calculateStats = (borrowed, lent, userId) => {
    const totalBorrowed = borrowed.length;
    const totalLent = lent.length;
    const activeLoans = lent.filter(t => t.status === 'active').length;
    const totalEarned = lent.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    setStats({
      totalBorrowed,
      totalLent,
      activeLoans,
      totalEarned
    });
  };

  // Helper function to calculate stats from transaction array
  const calculateStatsFromArray = (transactions, userId) => {
    const borrowedBooks = transactions.filter(t => 
      t.borrowerId === userId || (t.borrowerId && t.borrowerId._id === userId)
    );
    const lentBooks = transactions.filter(t => 
      t.lenderId === userId || (t.lenderId && t.lenderId._id === userId)
    );
    const activeLoans = transactions.filter(t => 
      (t.lenderId === userId || (t.lenderId && t.lenderId._id === userId)) && 
      t.status === 'active'
    );
    const totalEarned = lentBooks.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    setStats({
      totalBorrowed: borrowedBooks.length,
      totalLent: lentBooks.length,
      activeLoans: activeLoans.length,
      totalEarned
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'active': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'returned': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (transaction, currentUserId) => {
    const borrowerId = transaction.borrowerId?._id || transaction.borrowerId;
    const isUserBorrower = borrowerId === currentUserId;
    
    if (isUserBorrower) {
      return transaction.returnDate ? 'Returned' : 'Borrowed';
    } else {
      return transaction.returnDate ? 'Book Returned' : 'Lent Out';
    }
  };

  const handleReturnBook = async (transactionId) => {
    try {
      // Check if updateTransactionStatus API exists
      if (transactionsAPI.updateTransactionStatus) {
        await transactionsAPI.updateTransactionStatus(transactionId, 'returned');
        fetchAllData(); // Refresh data
      } else {
        alert("Return functionality is not yet implemented in the backend.");
      }
    } catch (error) {
      alert("Failed to return book: " + error.message);
    }
  };

  const handleRetry = () => {
    fetchAllData();
  };

  if (loading) {
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
            </nav>
          </div>
          <div className="mh-header-right">
            <Link to="/notifications" className="mh-icon-link" title="Notifications">🔔</Link>
            <Link to="/profile" className="mh-icon-link" title="Profile">👤</Link>
          </div>
        </header>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh' 
        }}>
          <div>Loading your history...</div>
        </div>
      </>
    );
  }

  // Get current user ID
  const getCurrentUserId = () => {
    return sessionStorage.getItem('userId');
  };

  const currentUserId = getCurrentUserId();
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    const borrowerId = transaction.borrowerId?._id || transaction.borrowerId;
    const lenderId = transaction.lenderId?._id || transaction.lenderId;
    
    if (activeTab === "borrowed") {
      return borrowerId === currentUserId;
    } else {
      return lenderId === currentUserId;
    }
  });

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
          </nav>
        </div>
        <div className="mh-header-right">
          <Link to="/notifications" className="mh-icon-link" title="Notifications">🔔</Link>
          <Link to="/profile" className="mh-icon-link" title="Profile">👤</Link>
        </div>
      </header>

      <div className="mh-container">
        <h1>My Book History</h1>

        {error && (
          <div style={{ 
            color: '#ff4444', 
            backgroundColor: '#ffe6e6', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={handleRetry}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mh-stats">
          <div className="mh-stat-box">
            <h2>{stats.totalBorrowed}</h2>
            <p>Books Borrowed</p>
          </div>
          <div className="mh-stat-box">
            <h2>{stats.totalLent}</h2>
            <p>Books Lent</p>
          </div>
          <div className="mh-stat-box">
            <h2>{stats.activeLoans}</h2>
            <p>Active Loans</p>
          </div>
          <div className="mh-stat-box">
            <h2>₹{stats.totalEarned}</h2>
            <p>Total Earned</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab("borrowed")}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: activeTab === "borrowed" ? '#6366f1' : '#f3f4f6',
              color: activeTab === "borrowed" ? 'white' : '#374151',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Books I Borrowed ({stats.totalBorrowed})
          </button>
          <button 
            onClick={() => setActiveTab("lent")}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === "lent" ? '#6366f1' : '#f3f4f6',
              color: activeTab === "lent" ? 'white' : '#374151',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Books I Lent ({stats.totalLent})
          </button>
        </div>

        {/* Transaction History */}
        <h2>{activeTab === "borrowed" ? "My Borrowed Books" : "My Lent Books"}</h2>
        
        {filteredTransactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            margin: '1rem 0' 
          }}>
            <p>No {activeTab} books yet.</p>
            {activeTab === "borrowed" ? (
              <Link to="/search" style={{ color: '#6366f1', textDecoration: 'none' }}>
                Browse available books →
              </Link>
            ) : (
              <Link to="/addbook" style={{ color: '#6366f1', textDecoration: 'none' }}>
                Add your first book →
              </Link>
            )}
          </div>
        ) : (
          <div className="mh-transaction-list" style={{ marginBottom: '2rem' }}>
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id || transaction.id} className="mh-transaction-card" style={{
                display: 'flex',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <img
                  src={(transaction.bookId?.imageUrl || transaction.book?.imageUrl) || 'https://via.placeholder.com/80x120?text=No+Image'}
                  alt={(transaction.bookId?.title || transaction.book?.title) || 'Book'}
                  style={{
                    width: '60px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x120?text=No+Image';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>
                    {(transaction.bookId?.title || transaction.book?.title) || 'Unknown Book'}
                  </h4>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                    {activeTab === "borrowed" 
                      ? `Lender: ${transaction.lenderId?.name || transaction.lender?.name || 'Unknown'}`
                      : `Borrower: ${transaction.borrowerId?.name || transaction.borrower?.name || 'Unknown'}`
                    }
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '14px' }}>
                    Amount: ₹{transaction.amount || 0}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '12px', color: '#6b7280' }}>
                    Borrowed: {formatDate(transaction.borrowDate || transaction.createdAt)}
                    {transaction.returnDate && ` • Returned: ${formatDate(transaction.returnDate)}`}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: getStatusColor(transaction.status) + '20',
                    color: getStatusColor(transaction.status),
                    fontWeight: 'bold'
                  }}>
                    {getStatusText(transaction, currentUserId)}
                  </span>
                  {!transaction.returnDate && (transaction.borrowerId?._id || transaction.borrowerId) === currentUserId && (
                    <button
                      onClick={() => handleReturnBook(transaction._id || transaction.id)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '6px 12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'block'
                      }}
                    >
                      Mark as Returned
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Books Section */}
        {userBooks.length > 0 && (
          <>
            <h2>My Listed Books ({userBooks.length})</h2>
            <div className="mh-book-grid">
              {userBooks.map((book) => (
                <div className="mh-book-card" key={book._id || book.id}>
                  <img
                    src={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Image'}
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
                    }}
                  />
                  <h4>{book.title}</h4>
                  <p style={{ fontSize: '12px', color: '#666' }}>by {book.author}</p>
                  <div className="mh-tags">
                    <span 
                      className="mh-tag"
                      style={{
                        backgroundColor: book.availability === 'Available' ? '#22c55e20' : '#f59e0b20',
                        color: book.availability === 'Available' ? '#22c55e' : '#f59e0b'
                      }}
                    >
                      {book.availability || book.status || 'Unknown'}
                    </span>
                    <span className="mh-tag">₹{book.price || book.rentPrice || 0}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', marginTop: '0.5rem' }}>
                    Added: {formatDate(book.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Activity Section */}
        <div className="mh-activity-section">
          <h3>Recent Activity</h3>
          {transactions.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No activity yet. Start by borrowing or lending books!
            </p>
          ) : (
            <ul>
              {transactions.slice(0, 10).map((transaction, index) => (
                <li key={transaction._id || transaction.id || index}>
                  <span>
                    {(transaction.borrowerId === currentUserId || transaction.borrowerId?._id === currentUserId)
                      ? `You borrowed "${(transaction.bookId?.title || transaction.book?.title) || 'Unknown Book'}"`
                      : `You lent "${(transaction.bookId?.title || transaction.book?.title) || 'Unknown Book'}" to ${transaction.borrowerId?.name || 'Unknown'}`
                    }
                  </span>
                  <span>{formatDate(transaction.borrowDate || transaction.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer className="mh-footer">
        BookExchange © 2025 | Stay updated with BookExchange
      </footer>
    </>
  );
}