// src/utils/auth.js
import { jwtDecode } from "jwt-decode"; // dùng named import

export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // dùng jwtDecode, không phải jwt_decode
    return {
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.error("Token không hợp lệ:", err);
    return null;
  }
};
