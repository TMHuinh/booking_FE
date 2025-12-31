import api from "./axiosInstance";

/**
 * ================= USER =================
 */

/**
 * Lấy tất cả thể loại
 */
export const getAllGenres = async () => {
  try {
    const response = await api.get("/genres");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách thể loại:", err);
    throw err;
  }
};

/**
 * ================= ADMIN =================
 */

/**
 * Thêm thể loại mới
 * @param {{ name: string }} data
 */
export const createGenre = async (data) => {
  try {
    const response = await api.post("/genres", data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tạo thể loại:", err);
    throw err;
  }
};

/**
 * Cập nhật thể loại
 * @param {string} id
 * @param {{ name: string }} data
 */
export const updateGenre = async (id, data) => {
  try {
    const response = await api.put(`/genres/${id}`, data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi cập nhật thể loại:", err);
    throw err;
  }
};

/**
 * Xóa thể loại
 * @param {string} id
 */
export const deleteGenre = async (id) => {
  try {
    await api.delete(`/genres/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa thể loại:", err);
    throw err;
  }
};
