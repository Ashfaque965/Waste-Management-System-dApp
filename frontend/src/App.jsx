// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { RecordCollection } from './pages/RecordCollection';
import { useAuthStore } from './store/authStore';

import './App.css';

function App() {
  const { isConnected, connectWallet } = useAuthStore();

  useEffect(() => {
    // Try to reconnect on app load if wallet was previously connected
    const checkWalletConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, [connectWallet]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/record-collection" element={<RecordCollection />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
