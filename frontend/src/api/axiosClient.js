import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userID");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.respone.use(
  (respone) => {
    return respone.data;
  },
  (error) => {
    if (error.respone?.status === 401) {
      localStorage.removeItem("userID");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
