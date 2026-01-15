// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // BẮT BUỘC để gửi refresh token cookie
});

// Gắn access token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu access token hết hạn
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Gọi refresh token
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.result.accessToken;

        // Lưu token mới
        localStorage.setItem("accessToken", newAccessToken);

        // Gửi lại request cũ
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // Refresh token cũng hết hạn → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
