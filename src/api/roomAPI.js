import api from "./axiosInstance";

/**
 * ================= ROOM =================
 */

export const getAllRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phòng:", err);
    throw err;
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết phòng:", err);
    throw err;
  }
};

/**
 * ================= ADMIN =================
 */
export const createRoom = async (data) => {
  try {
    const response = await api.post("/rooms", data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tạo phòng:", err);
    throw err;
  }
};

export const updateRoom = async (id, data) => {
  try {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi cập nhật phòng:", err);
    throw err;
  }
};

export const deleteRoom = async (id) => {
  try {
    await api.delete(`/rooms/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa phòng:", err);
    throw err;
  }
};
