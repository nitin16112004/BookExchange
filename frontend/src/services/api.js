// src/services/api.js - Updated with missing functions

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Authentication API
// Authentication API - FIXED VERSION
export const authAPI = {
  login: async (formData) => { // Changed to accept formData object
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,     // Extract email from formData
        password: formData.password // Extract password from formData
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('userId', data.user._id);
    return data;
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    
    const data = await response.json();
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('userId', data.user._id);
    return data;
  },

  logout: () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// User API - Added missing functions
export const userAPI = {
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    
    return await response.json();
  },

  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    return await response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  },

  uploadAvatar: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }
    
    return await response.json();
  }
};

// Books API
export const booksAPI = {
  getAllBooks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/books?${queryParams}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    return await response.json();
  },

  getBookById: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get book details');
    }
    
    return await response.json();
  },

  getUserBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books/user/books`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user books');
    }
    
    return await response.json();
  },

  addBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add book');
    }
    
    return await response.json();
  },

  updateBook: async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return await response.json();
  },

  deleteBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    
    return await response.json();
  }
};

// Borrow Requests API
export const borrowRequestsAPI = {
  sendRequest: async (bookId, message) => {
    const response = await fetch(`${API_BASE_URL}/borrow-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ bookId, message }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send request');
    }
    
    return await response.json();
  },

  getReceivedRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/borrow-requests/received`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch received requests');
    }
    
    return await response.json();
  },

  getSentRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/borrow-requests/sent`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sent requests');
    }
    
    return await response.json();
  },

  updateRequestStatus: async (requestId, status, response_message = '') => {
    const response = await fetch(`${API_BASE_URL}/borrow-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status, response_message }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update request');
    }
    
    return await response.json();
  },

  deleteRequest: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/borrow-requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete request');
    }
    
    return await response.json();
  }
};

// Transactions API
export const transactionsAPI = {
  getUserTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
  },

  createTransaction: async (transactionData) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }
    
    return await response.json();
  },

  updateTransactionStatus: async (transactionId, status) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }
    
    return await response.json();
  }
};

// Chat API
export const chatAPI = {
  getMessages: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${requestId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return await response.json();
  },

  sendMessage: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/chat/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return await response.json();
  },

  markAsRead: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/chat/mark-read/${requestId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }
    
    return await response.json();
  }
};

// Payment API
export const paymentAPI = {
  createOrder: async (amount, currency = 'INR') => {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ amount, currency }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }
    
    return await response.json();
  },

  verifyPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      throw new Error('Payment verification failed');
    }
    
    return await response.json();
  }
};    
    