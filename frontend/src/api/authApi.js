import axiosClient from "./axiosClient";

const authApi = {
  login: (credentials) => {
    // Hỗ trợ đăng nhập bằng email hoặc username
    return axiosClient.post("/login", {
      username: credentials.email || credentials.username,
      password: credentials.password,
    });
  },

  logout: () => {
    // Xóa tất cả thông tin đăng nhập
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    // Kiểm tra có token hoặc userID
    return !!(localStorage.getItem("token") || localStorage.getItem("userID"));
  },

  getStoredUser: () => {
    try {
      // Ưu tiên lấy từ user object đã lưu
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }

      // Fallback về cách cũ
      const userID = localStorage.getItem("userID");
      const username = localStorage.getItem("username");
      if (userID && username) {
        return {
          user_id: parseInt(userID),
          userID: parseInt(userID),
          username,
        };
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
    }

    // Nếu thiếu thông tin thì return null (user chưa login)
    return null;
  },
};

export default authApi;
