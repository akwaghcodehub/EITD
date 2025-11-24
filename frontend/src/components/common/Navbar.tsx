import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { IoMenu, IoClose } from 'react-icons/io5';
import Button from './Button';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-illini-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-illini-orange">Illini</span>
            <span className="text-2xl font-bold">Lost & Found</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-illini-orange transition">
              Home
            </Link>
            <Link to="/browse" className="hover:text-illini-orange transition">
              Browse Items
            </Link>
            <Link to="/marketplace" className="hover:text-illini-orange transition">
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/report-lost" className="hover:text-illini-orange transition">
                  Report Lost
                </Link>
                <Link to="/report-found" className="hover:text-illini-orange transition">
                  Report Found
                </Link>
                <Link to="/my-items" className="hover:text-illini-orange transition">
                  My Items
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-illini-orange transition">
                    Admin
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout} className="!py-1 !px-4">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="!py-1 !px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="!py-1 !px-4">
                    Sign Up
                  </Button>
                </Link>
                {/* ✅ ADD THIS */}
                <Link to="/admin/login">
                  <Button variant="secondary" className="!py-1 !px-4 !text-sm">
                    Admin
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Items
              </Link>
              <Link
                to="/marketplace"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/report-lost"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Report Lost
                  </Link>
                  <Link
                    to="/report-found"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Report Found
                  </Link>
                  <Link
                    to="/my-items"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Items
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="hover:text-illini-orange transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left hover:text-illini-orange transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  {/* ✅ ADD THIS */}
                  <Link to="/admin/login" className="hover:text-illini-orange transition" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
