// src/api/bookingAPI.js
import api from "./axiosInstance";

export const createBooking = (showtimeId, data) => {
  return api.post(`/bookings?showtimeId=${showtimeId}`, data);
};

export const confirmBooking = (bookingId, paymentId, method) => {
  return api.post(
    `/bookings/confirm/${bookingId}`,
    null,
    {
      params: { paymentId, method }, // MOMO | VNPAY | CASH
    }
  );
};

export const getBookingsByUser = (userId) => {
  return api.get(`/bookings/user/${encodeURIComponent(userId)}`);
};


