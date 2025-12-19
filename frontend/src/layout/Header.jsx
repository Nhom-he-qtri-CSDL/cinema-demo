import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">CineBook</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          {user && (
            <Link to="/my-tickets" className="nav-link">
              My Tickets
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-info">{user.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
              <Link to="/login" className="btn-signin">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
