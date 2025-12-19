import axiosClient from "./axiosClient";

const authApi = {
  login: (username, password) => {
    return axiosClient.post("/login", {
      username,
      password,
    });
  },

  logout: () => {
    // Xóa userID
    localStorage.removeItem("userID");
    // Xóa username (nếu lưu)
    localStorage.removeItem("username");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("userID");
  },

  getStoredUser: () => {
    const userID = localStorage.getItem("userID");
    const username = localStorage.getItem("username");
    if (userID && username) {
      return {
        user_id: parseInt(userID),
        username,
      };
    }

    // Nếu thiếu 1 trong 2 thì return null (user chưa login)
    return null;
  },
};

export default authApi;
