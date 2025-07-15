import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AddBookPage from './AddBookPage';
import SearchBookPage from './SearchBookPage';
import MyHistoryPage from './MyHistoryPage';
import BorrowRequestsPage from "./pages/BorrowRequestsPage";
import ExchangeChatPage from "./pages/ExchangeChatPage";
import MembershipPage from "./pages/MembershipPage";
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';
import NotificationPage from './NotificationPage';
import ProtectedRoute from './components/ProtectedRoute'; // import this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/addbook" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchBookPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><MyHistoryPage /></ProtectedRoute>} />
        <Route path="/borrowrequests" element={<ProtectedRoute><BorrowRequestsPage /></ProtectedRoute>} />
        <Route path="/exchangechat" element={<ProtectedRoute><ExchangeChatPage /></ProtectedRoute>} />
        <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
