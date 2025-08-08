import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, borrowRequestsAPI, transactionsAPI } from './services/api.js';
import './SearchBooks.css';

function SearchBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [locationFilter]);

  const fetchBooks = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {};
      if (locationFilter) filters.location = locationFilter;
      if (search) filters.search = search;

      const data = await booksAPI.getAllBooks(filters);
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchQuery);
  };

  const handleBorrow = async (book) => {
    try {
      // Check if user is logged in
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const authToken = sessionStorage.getItem('authToken');
      
      if (!isLoggedIn || !authToken) {
        alert('Please login to borrow books');
        return;
      }

      // First, create a borrow request
      await borrowRequestsAPI.createRequest(
        book._id, 
        `Hi! I would like to borrow "${book.title}" by ${book.author}.`
      );

      // Initialize Razorpay payment
      const options = {
        key: "rzp_test_1234567890abcdef", // Replace with your actual Razorpay key
        amount: book.price * 100, // Amount in paise
        currency: "INR",
        name: "BookLoop",
        description: `Borrowing "${book.title}"`,
        handler: async function (response) {
          try {
            // Create transaction record after successful payment
            await transactionsAPI.createTransaction(
              book._id,
              response.razorpay_payment_id,
              book.price
            );
            
            alert(`✅ Payment successful! Borrow request sent to ${book.ownerName}.\nTransaction ID: ${response.razorpay_payment_id}`);
            
            // Refresh books list
            fetchBooks(searchQuery);
          } catch (err) {
            console.error('Error creating transaction:', err);
            alert('Payment successful but failed to record transaction. Please contact support.');
          }
        },
        prefill: {
          name: sessionStorage.getItem('userName') || "User",
          email: sessionStorage.getItem('userEmail') || "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (err) {
      if (err.message.includes('Request already sent')) {
        alert('You have already sent a request for this book!');
      } else if (err.message.includes('Cannot borrow your own book')) {
        alert('You cannot borrow your own book!');
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleFilterChange = (filterType, value, checked) => {
    switch (filterType) {
      case 'genre':
        setGenreFilter(prev => 
          checked 
            ? [...prev, value]
            : prev.filter(item => item !== value)
        );
        break;
      case 'rating':
        setRatingFilter(prev => 
          checked 
            ? [...prev, value]
            : prev.filter(item => item !== value)
        );
        break;
      case 'availability':
        setAvailabilityFilter(prev => 
          checked 
            ? [...prev, value]
            : prev.filter(item => item !== value)
        );
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        fontSize: '18px' 
      }}>
        Loading books...
      </div>
    );
  }

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
          </nav>
        </div>
        <div className="header-right">
          <Link to="/notifications" className="icon-link">🔔</Link>
          <Link to="/profile" className="icon-link">👤</Link>
        </div>
      </header>

      <div className="container">
        <aside className="sidebar">
          <h4>Filters</h4>
          
          <p><strong>Genre</strong></p>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('genre', 'Fantasy', e.target.checked)}
            /> Fantasy
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('genre', 'Fiction', e.target.checked)}
            /> Fiction
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('genre', 'Mystery', e.target.checked)}
            /> Mystery
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('genre', 'Sci-Fi', e.target.checked)}
            /> Sci-Fi
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('genre', 'Biography', e.target.checked)}
            /> Biography
          </label><br />

          <p style={{ marginTop: '1rem' }}><strong>Rating</strong></p>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('rating', '5', e.target.checked)}
            /> 5 Stars
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('rating', '4', e.target.checked)}
            /> 4 Stars
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('rating', '3', e.target.checked)}
            /> 3 Stars
          </label><br />

          <p style={{ marginTop: '1rem' }}><strong>Availability</strong></p>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('availability', 'Available', e.target.checked)}
            /> Available
          </label><br />
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => handleFilterChange('availability', 'Coming Soon', e.target.checked)}
            /> Coming Soon
          </label><br />

          <div style={{ marginTop: '1rem' }}>
            <p><strong>Location</strong></p>
            <input
              type="text"
              placeholder="Enter city or area"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </aside>

        <main className="main">
          <section className="search-header">
            <h2>Search Books ({books.length} found)</h2>
            <form onSubmit={handleSearch} className="search-bar">
              <input 
                type="text" 
                placeholder="Search books by title, author..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </section>

          {error && (
            <div style={{ 
              color: '#ff4444', 
              backgroundColor: '#ffe6e6', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <section className="book-grid">
            {books.length > 0 ? (
              books.map((book) => (
                <div className="book" key={book._id}>
                  <img 
                    src={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Image'} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
                    }}
                  />
                  <h4>{book.title}</h4>
                  <p style={{ fontSize: '12px', color: '#666' }}>by {book.author}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    📍 {book.location} | 💰 ₹{book.price}
                  </p>
                  <p style={{ fontSize: '11px', color: '#999' }}>
                    Condition: {book.condition}
                  </p>
                  <p style={{ fontSize: '11px', color: '#007bff' }}>
                    Owner: {book.ownerName}
                  </p>
                  {book.availability === 'Available' ? (
                    <button onClick={() => handleBorrow(book)}>
                      Borrow Now
                    </button>
                  ) : (
                    <button disabled style={{ backgroundColor: '#ccc' }}>
                      {book.availability}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '2rem',
                color: '#666' 
              }}>
                {searchQuery || locationFilter ? 
                  'No books found matching your search criteria.' : 
                  'No books available at the moment.'}
              </div>
            )}
          </section>

          <div className="promo-box">
            <h3>Share Your Books with the Community!</h3>
            <p>Add your books and start earning while helping fellow readers</p>
            <Link to="/addbook">
              <button className="add-book-btn">Add Book</button>
            </Link>
          </div>
        </main>
      </div>

      <footer className="footer">
        <div className="subscribe">
          <label>Stay updated with BookExchange</label><br />
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
        <p>&copy; 2025 BookExchange. All rights reserved.</p>
      </footer>
    </>
  );
}

export default SearchBooks;