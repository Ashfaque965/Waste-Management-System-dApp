// frontend/src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

export const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { account, connectWallet, disconnectWallet } = useAuthStore();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            ♻️ Waste Management
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-green-100 transition">
              Dashboard
            </Link>
            <Link to="/record-collection" className="hover:text-green-100 transition">
              Record Collection
            </Link>
            <Link to="/recycling" className="hover:text-green-100 transition">
              Recycling
            </Link>
            <Link to="/statistics" className="hover:text-green-100 transition">
              Statistics
            </Link>
            <Link to="/profile" className="hover:text-green-100 transition">
              Profile
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm bg-green-700 px-3 py-2 rounded">
                  {truncateAddress(account)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/dashboard" className="block py-2 hover:text-green-100">
              Dashboard
            </Link>
            <Link
              to="/record-collection"
              className="block py-2 hover:text-green-100"
            >
              Record Collection
            </Link>
            <Link to="/recycling" className="block py-2 hover:text-green-100">
              Recycling
            </Link>
            <Link to="/statistics" className="block py-2 hover:text-green-100">
              Statistics
            </Link>
            <Link to="/profile" className="block py-2 hover:text-green-100">
              Profile
            </Link>
            {account ? (
              <>
                <div className="py-2 text-sm">{truncateAddress(account)}</div>
                <button
                  onClick={disconnectWallet}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
