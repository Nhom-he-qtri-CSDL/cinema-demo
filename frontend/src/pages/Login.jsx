import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import MovieCarousel from "../components/MovieCarousel";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API login thật để lấy JWT token
      const response = await authApi.login({
        username: email, // Backend dùng username field
        password: password
      });

      if (response.success) {
        // Lưu thông tin user và token
        const userData = {
          userID: response.data.userID,
          id: response.data.userID,
          username: response.data.username,
          email: email,
          token: response.data.token,
          fullName: response.data.username
        };

        login(userData);
        navigate("/");
      } else {
        alert(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Lỗi đăng nhập: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Posters Carousel */}
        <div className="auth-posters">
          <MovieCarousel />
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1>Sign In</h1>
              <p>Welcome back to CineBook</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/signup">Create one now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
