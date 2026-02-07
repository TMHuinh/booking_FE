import { Layout } from "antd";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <Layout>
        <AdminHeader />
        <Content style={{ margin: 16, background: "#fff" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
