import axios from "axios";
import api from "./axiosInstance";

/**
 * ================= USER =================
 */

/**
 * Lấy tất cả phim
 */
export const getAllMovies = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/movies");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phim:", err);
    throw err;
  }
};

/**
 * Lấy phim đang chiếu
 */
export const getShowingMovies = async () => {
  try {
    const response = await api.get("/movies/showing");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy phim đang chiếu:", err);
    throw err;
  }
};

/**
 * Lấy phim sắp chiếu
 */
export const getComingSoonMovies = async () => {
  try {
    const response = await api.get("/movies/coming-soon");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy phim sắp chiếu:", err);
    throw err;
  }
};

/**
 * Lấy chi tiết phim theo id
 * @param {string} id
 */
export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết phim:", err);
    throw err;
  }
};

/**
 * Tìm phim theo tên
 * @param {string} title
 */
export const searchMovies = async (title) => {
  try {
    const response = await api.get("/movies/search", {
      params: { title },
    });
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tìm phim:", err);
    throw err;
  }
};

/**
 * Lọc phim theo thể loại
 * @param {string} genreId
 */
export const filterMoviesByGenre = async (genreId) => {
  try {
    const response = await api.get("/movies/filter", {
      params: { genreId },
    });
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lọc phim:", err);
    throw err;
  }
};

/**
 * ================= ADMIN =================
 */

/**
 * Tạo phim mới
 */
export const createMovie = async (data) => {
  try {
    const response = await api.post("/movies", data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi tạo phim:", err);
    throw err;
  }
};

/**
 * Cập nhật phim
 * @param {string} id
 */
export const updateMovie = async (id, data) => {
  try {
    const response = await api.put(`/movies/${id}`, data);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi cập nhật phim:", err);
    throw err;
  }
};

/**
 * Xóa phim
 * @param {string} id
 */
export const deleteMovie = async (id) => {
  try {
    await api.delete(`/movies/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa phim:", err);
    throw err;
  }
};

/**
 * Bật / tắt trạng thái phim
 * @param {string} id
 */
export const toggleMovieStatus = async (id) => {
  try {
    const response = await api.patch(`/movies/${id}/toggle-status`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi toggle trạng thái phim:", err);
    throw err;
  }
};
