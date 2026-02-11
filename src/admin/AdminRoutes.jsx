import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movies" element={<Movies />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
