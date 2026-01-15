import "./App.css";
import api from "./api/axiosInstance";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import MovieDetailPage from "./pages/MovieDetailPage";
import AllMoviesPage from "./pages/AllMoviesPage";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  const TitleHandler = () => {
    useEffect(() => {
      const refreshOnLoad = async () => {
        try {
          const res = await api.post("/auth/refresh");
          const newToken = res.data.result.accessToken;
          localStorage.setItem("accessToken", newToken);
          console.log("Refresh token khi load trang thành công");
        } catch (err) {
          // ❌ Không login hoặc refresh token hết hạn → bỏ qua
          console.log("Không có refresh token hoặc chưa login");
        }
      };

      refreshOnLoad();
    }, []);
    const location = useLocation();

    useEffect(() => {
      const fetchDynamicTitle = async () => {
        try {
          let title = "FilmSpot";

          if (location.pathname === "/") title = "Trang chủ";
          else if (location.pathname === "/login") title = "Đăng nhập";
          else if (location.pathname === "/register") title = "Đăng ký";
          else if (location.pathname.startsWith("/search/"))
            title = "Kết quả tìm kiếm";
          else if (location.pathname.startsWith("/profile"))
            title = "Thông tin cá nhân";
          else if (location.pathname.startsWith("/booking")) title = "Đặt vé";
          else if (location.pathname.startsWith("/orders/"))
            title = "Chi tiết đơn hàng";
          else if (location.pathname.startsWith("/orders"))
            title = "Lịch sử đơn hàng";
          else if (location.pathname.startsWith("/verify/"))
            title = "Xác thực tài khoản";
          else if (location.pathname.startsWith("/admin/dashboard"))
            title = "Trang quản trị";
          else if (location.pathname.startsWith("/admin/movie"))
            title = "Quản lý sản phẩm";
          else if (location.pathname.startsWith("/admin/categories"))
            title = "Quản lý danh mục";
          else if (location.pathname.startsWith("/admin/brands"))
            title = "Quản lý thương hiệu";
          else if (location.pathname.startsWith("/admin/users"))
            title = "Quản lý người dùng";
          else if (location.pathname.startsWith("/admin/orders"))
            title = "Quản lý đơn hàng";
          else if (location.pathname.startsWith("/movie/")) {
            const id = location.pathname.split("/")[2];
            const res = await axiosClient.get(`/movie/${id}`);
            title = res.data.title;
          } else if (location.pathname.startsWith("/category/")) {
            const id = location.pathname.split("/")[2];
            const res = await axiosClient.get(`/categories/${id}`);
            title = res.data.name;
          } else if (location.pathname.startsWith("/reviews/product/")) {
            const id = location.pathname.split("/")[3];
            const res = await axiosClient.get(`/products/${id}`);
            title = `Đánh giá ${res.data.name}`;
          } else if (location.pathname.startsWith("/brand/")) {
            const id = location.pathname.split("/")[2];
            const res = await axiosClient.get(`/brands/${id}`);
            title = res.data.name;
          }

          document.title = `${title} | FilmSpot`;
        } catch (err) {
          document.title = "FilmSpot";
        }
      };

      fetchDynamicTitle();
    }, [location.pathname]);

    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Header />
      <TitleHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<AllMoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
