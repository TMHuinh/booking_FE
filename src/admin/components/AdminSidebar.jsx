import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const AdminSidebar = () => {
  return (
    <Sider collapsible>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="movies" icon={<VideoCameraOutlined />}>
          <Link to="/admin/movies">Quản lý phim</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;
