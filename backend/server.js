const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const http = require('http');
const auth = require('./middleware/auth');

require('dotenv').config();

const app = express();

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookloop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  avatar: { type: String, default: '' },
  membershipStatus: { type: String, default: 'Free' },
  booksShared: { type: Number, default: 0 },
  memberSince: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  condition: { type: String, required: true },
  availability: { type: String, default: 'Available' },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Borrow Request Schema
const borrowRequestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'returned'], default: 'pending' },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRequest', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'image', 'location'], default: 'text' },
  isRead: { type: Boolean, default: false }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRequest', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String },
  scheduledBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Socket.io Authentication Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      next();
    });
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join chat room
  socket.on('join_chat', (data) => {
    const { roomId, userId, requestId } = data;
    socket.join(roomId);
    socket.userId = userId;
    socket.requestId = requestId;
    
    console.log(`User ${userId} joined room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_joined', {
      userId: userId,
      message: 'User joined the chat'
    });
  });

  // Handle message sending
  socket.on('send_message', async (messageData) => {
    try {
      console.log('Socket received message:', messageData);
      
      const roomId = `chat_${messageData.requestId}`;
      
      // Broadcast message to all users in the room
      io.to(roomId).emit('message_received', messageData);
      
      console.log(`Message broadcasted to room ${roomId}`);
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const roomId = `chat_${data.requestId}`;
    socket.to(roomId).emit('user_typing', {
      userId: data.userId,
      requestId: data.requestId
    });
    
    // Auto-stop typing after 2 seconds
    setTimeout(() => {
      socket.to(roomId).emit('user_stopped_typing', {
        userId: data.userId
      });
    }, 2000);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.requestId) {
      const roomId = `chat_${socket.requestId}`;
      socket.to(roomId).emit('user_left', {
        userId: socket.userId,
        message: 'User left the chat'
      });
    }
  });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        membershipStatus: user.membershipStatus,
        booksShared: user.booksShared,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        avatar: user.avatar,
        membershipStatus: user.membershipStatus,
        booksShared: user.booksShared,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book Routes
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, author, description, imageUrl, condition, availability, location, price } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = new Book({
      title,
      author,
      description,
      imageUrl,
      condition,
      availability,
      location,
      price,
      ownerId: req.user.userId,
      ownerName: user.name
    });

    await book.save();

    // Update user's books shared count
    await User.findByIdAndUpdate(req.user.userId, { $inc: { booksShared: 1 } });

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const { location, genre, search } = req.query;
    let filter = { availability: 'Available' };

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') }
      ];
    }

    const books = await Book.find(filter)
      .populate('ownerId', 'name email location')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/books/user/:userId', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.params.userId });
    res.json(books);
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Borrow Request Routes
app.post('/api/borrow-requests', authenticateToken, async (req, res) => {
  try {
    const { bookId, message } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.ownerId.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot borrow your own book' });
    }

    // Check if request already exists
    const existingRequest = await BorrowRequest.findOne({
      bookId,
      requesterId: req.user.userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const borrowRequest = new BorrowRequest({
      bookId,
      requesterId: req.user.userId,
      ownerId: book.ownerId,
      message
    });

    await borrowRequest.save();

    res.status(201).json({
      message: 'Borrow request sent successfully',
      request: borrowRequest
    });
  } catch (error) {
    console.error('Borrow request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/borrow-requests/incoming', authenticateToken, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ ownerId: req.user.userId })
      .populate('bookId', 'title author imageUrl price')
      .populate('requesterId', 'name email location')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/borrow-requests/outgoing', authenticateToken, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ requesterId: req.user.userId })
      .populate('bookId', 'title author imageUrl price')
      .populate('ownerId', 'name email location')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    console.log('Getting profile for user:', req.userId);
    
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
app.get('/api/users/:userId', auth, async (req, res) => {
  try {
    console.log('Getting user by ID:', req.params.userId);
    
    const user = await User.findById(req.params.userId).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return public user information
    const publicUser = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar || '/default-avatar.png',
      location: user.location,
      joinedDate: user.createdAt,
      totalBooksShared: await Book.countDocuments({ owner: user._id }),
      rating: user.rating || 4.5
    };
    
    res.json(publicUser);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { name, location, bio, phone } = req.body;
    
    console.log('Updating profile for user:', req.userId);
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload avatar (if you want to implement file upload)
app.post('/api/users/upload-avatar', auth, async (req, res) => {
  try {
    // For now, we'll accept a URL. In production, you'd use multer for file upload
    const { avatarUrl } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.avatar = avatarUrl;
    await user.save();
    
    res.json({ 
      message: 'Avatar updated successfully',
      avatar: user.avatar 
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
app.get('/api/users/stats', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [
      totalBooksAdded,
      totalBooksBorrowed,
      totalBooksLent,
      totalEarnings,
      pendingRequests
    ] = await Promise.all([
      Book.countDocuments({ owner: userId }),
      Transaction.countDocuments({ borrower: userId, type: 'borrow' }),
      Transaction.countDocuments({ lender: userId, type: 'lend' }),
      Transaction.aggregate([
        { $match: { lender: mongoose.Types.ObjectId(userId), status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      BorrowRequest.countDocuments({ book: { $in: await Book.find({ owner: userId }).distinct('_id') }, status: 'pending' })
    ]);
    res.json({
      totalBooksAdded,
      totalBooksBorrowed,
      totalBooksLent,
      totalEarnings: totalEarnings[0]?.total || 0,
      pendingRequests
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/borrow-requests/:requestId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { requestId } = req.params;

    const request = await BorrowRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    res.json({
      message: `Request ${status} successfully`,
      request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Transaction Routes
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { bookId, paymentId, amount } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const transaction = new Transaction({
      bookId,
      borrowerId: req.user.userId,
      lenderId: book.ownerId,
      amount,
      paymentId,
      status: 'completed'
    });

    await transaction.save();

    // Update book availability
    await Book.findByIdAndUpdate(bookId, { availability: 'Borrowed' });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/transactions/history', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { borrowerId: req.user.userId },
        { lenderId: req.user.userId }
      ]
    })
      .populate('bookId', 'title author imageUrl')
      .populate('borrowerId', 'name email')
      .populate('lenderId', 'name email')
      .sort({ borrowDate: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Profile Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, location, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, location, avatar },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search Routes
app.get('/api/search/books', async (req, res) => {
  try {
    const { q, location } = req.query;
    let filter = { availability: 'Available' };

    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    const books = await Book.find(filter)
      .populate('ownerId', 'name location')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Featured/Popular Books
app.get('/api/books/featured', async (req, res) => {
  try {
    const books = await Book.find({ availability: 'Available' })
      .populate('ownerId', 'name location')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API Routes for Chat (optional - for REST API access)
// Get chat messages for a request
app.get('/api/chat/messages/:requestId', auth, async (req, res) => {
  try {
    console.log(`Loading messages for request: ${req.params.requestId}`);
    
    const messages = await ChatMessage.find({ 
      requestId: req.params.requestId 
    })
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .sort({ timestamp: 1 });

    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error loading chat messages:', error);
    res.status(500).json({ message: 'Error loading messages' });
  }
});

// Send/Save chat message
app.post('/api/chat/send-message', auth, async (req, res) => {
  try {
    const { requestId, senderId, senderName, receiverId, message, type = 'text' } = req.body;
    
    console.log('Saving message:', { requestId, senderId, senderName, receiverId, message });

    const chatMessage = new ChatMessage({
      requestId,
      senderId,
      senderName,
      receiverId,
      message,
      type,
      timestamp: new Date()
    });

    await chatMessage.save();
    
    console.log('Message saved successfully');
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message' });
  }
});

// Mark messages as read
app.put('/api/chat/mark-read/:requestId', auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { 
        requestId: req.params.requestId,
        receiverId: req.userId,
        isRead: false
      },
      { isRead: true }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

// Update the server listening part
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready`);
});