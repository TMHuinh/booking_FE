import api from "./axiosInstance";

/**
 * ================= CINEMA =================
 */

/**
 * Lấy tất cả rạp
 */
export const getAllCinemas = async () => {
  try {
    const response = await api.get("/cinemas");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách rạp:", err);
    throw err;
  }
};

/**
 * Lấy rạp theo id
 */
export const getCinemaById = async (id) => {
  try {
    const response = await api.get(`/cinemas/${id}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết rạp:", err);
    throw err;
  }
};

/**
 * ================= ADMIN =================
 */
export const createCinema = async (data) => {
  try {
    const response = await api.post("/cinemas", data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tạo rạp:", err);
    throw err;
  }
};

export const updateCinema = async (id, data) => {
  try {
    const response = await api.put(`/cinemas/${id}`, data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi cập nhật rạp:", err);
    throw err;
  }
};

export const deleteCinema = async (id) => {
  try {
    await api.delete(`/cinemas/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa rạp:", err);
    throw err;
  }
};
