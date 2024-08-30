import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import MyDonationsPage from './pages/MyDonationsPage';
import AllDonationsPage from './pages/AllDonationsPage';
import RequestsPage from './pages/RequestsPage';
import AIChatbot from './components/AIChatbot';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-main">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/my-donations" element={<MyDonationsPage />} />
          <Route path="/all-donations" element={<AllDonationsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/chatbot" element={<AIChatbot />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen bg-main font-aladin">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;