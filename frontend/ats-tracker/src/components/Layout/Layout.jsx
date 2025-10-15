import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Menu, X, Sun, Moon, User, LogOut, Settings } from "lucide-react";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Home" },
    ...(user
      ? [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/profile", label: "Profile" },
        ]
      : []),
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-icon">ATS</div>
            <span className="logo-text">Candidate Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <User size={20} />
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <Settings size={16} />
                    Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="nav-mobile">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="mobile-user-menu">
                <div className="user-info">
                  <User size={20} />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-links">
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 ATS Candidate Tracker. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
