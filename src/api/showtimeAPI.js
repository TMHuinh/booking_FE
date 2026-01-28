import api from "./axiosInstance";

/**
 * ================= SHOWTIME =================
 */

/**
 * Lấy tất cả suất chiếu
 */
export const getAllShowtimes = async () => {
  try {
    const response = await api.get("/showtimes");
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách suất chiếu:", err);
    throw err;
  }
};

/**
 * Lấy suất chiếu theo ID
 */
export const getShowtimeById = async (id) => {
  try {
    const response = await api.get(`/showtimes/${id}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết suất chiếu:", err);
    throw err;
  }
};

/**
 * 🔥 Lấy suất chiếu theo phim (MovieDetailPage dùng cái này)
 */
export const getShowtimesByMovieId = async (movieId) => {
  try {
    const response = await api.get(`/showtimes/movie/${movieId}`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy suất chiếu theo phim:", err);
    throw err;
  }
};

/**
 * ================= SEAT FLOW =================
 */

/**
 * Giữ ghế tạm thời
 */
export const holdSeats = async (showtimeId, seatCodes, userId) => {
  try {
    await api.post(`/showtimes/${showtimeId}/hold`, {
      seatCodes,
      userId,
    });
  } catch (err) {
    console.error("Lỗi khi giữ ghế:", err);
    throw err;
  }
};

/**
 * Nhả ghế
 */
export const releaseSeats = async (showtimeId, userId) => {
  try {
    await api.post(`/showtimes/${showtimeId}/release`, null, {
      params: { userId },
    });
  } catch (err) {
    console.error("Lỗi khi nhả ghế:", err);
    throw err;
  }
};

/**
 * Xác nhận đặt vé
 */
export const confirmBooking = async (showtimeId, seats, userId) => {
  try {
    await api.post(`/showtimes/${showtimeId}/confirm`, seats, {
      params: { userId },
    });
  } catch (err) {
    console.error("Lỗi khi xác nhận đặt vé:", err);
    throw err;
  }
};

/**
 * Lấy trạng thái ghế theo suất chiếu
 */
export const getSeatStatusByShowtime = async (showtimeId) => {
  try {
    const response = await api.get(`/showtimes/${showtimeId}/seats`);
    return response.data.result;
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái ghế:", err);
    throw err;
  }
};
