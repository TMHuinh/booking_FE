// authAPI.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// ================= LOGIN =================
export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
    const result = res.data.result;

    if (result?.accessToken) {
      localStorage.setItem("accessToken", result.accessToken); // chỉ lưu accessToken
    }

    return result;
  } catch (err) {
    console.error("Lỗi đăng nhập:", err.response?.data || err.message);
    throw err;
  }
};

// ================= REGISTER =================
export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
    return res.data.result;
  } catch (err) {
    console.error("Lỗi đăng ký:", err.response?.data || err.message);
    throw err;
  }
};

// ================= LOGOUT =================
export const logout = () => {
  localStorage.removeItem("accessToken");
};
