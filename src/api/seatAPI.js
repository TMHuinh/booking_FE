import api from "./axiosInstance";

/**
 * ================= SEAT =================
 */

export const getAllSeats = async () => {
  try {
    const response = await api.get("/seats");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách ghế:", err);
    throw err;
  }
};

export const getSeatById = async (id) => {
  try {
    const response = await api.get(`/seats/${id}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy ghế:", err);
    throw err;
  }
};

/**
 * ================= ADMIN =================
 */
export const createSeat = async (data) => {
  try {
    const response = await api.post("/seats", data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tạo ghế:", err);
    throw err;
  }
};

export const updateSeat = async (id, data) => {
  try {
    const response = await api.put(`/seats/${id}`, data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi cập nhật ghế:", err);
    throw err;
  }
};

export const deleteSeat = async (id) => {
  try {
    await api.delete(`/seats/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa ghế:", err);
    throw err;
  }
};
