import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import HomePage from './HomePage';
import AddBookPage from './AddBookPage';
import SearchBookPage from './SearchBookPage';
import MyHistoryPage from './MyHistoryPage';
import BorrowRequestsPage from "./pages/BorrowRequestsPage";
import ExchangeChatPage from "./pages/ExchangeChatPage";
import MembershipPage from "./pages/MembershipPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/addbook" element={<AddBookPage />} />
        <Route path="/search" element={<SearchBookPage />} />
        <Route path="/history" element={<MyHistoryPage />} />
        <Route path="/borrowrequests" element={<BorrowRequestsPage />} />
        <Route path="/exchangechat" element={<ExchangeChatPage />} />
        <Route path="/membership" element={<MembershipPage />} />
      </Routes>
    </Router>
  );
}

export default App;
