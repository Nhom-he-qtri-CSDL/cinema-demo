import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authApi from "../api/authApi";
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
      const loginData = {
        email: email, // Backend đã sửa để dùng email field
        password: password,
      };

      console.log("Sending login request with:", loginData);
      const response = await authApi.login(loginData);

      // Backend trả về response trực tiếp, không có wrapper success/data
      if (response && response.user_id) {
        // Lưu thông tin user và token từ response
        const userData = {
          userID: response.user_id,
          id: response.user_id,
          email: response.email,
          token: response.token,
          fullName: response.email.split("@")[0], // Dùng phần đầu email làm display name
          username: response.email, // Để tương thích với code cũ
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
