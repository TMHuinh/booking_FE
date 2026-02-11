import { Layout, Avatar, Dropdown, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AdminHeader = () => {
  const menuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* LEFT */}
      <div style={{ fontSize: 18, fontWeight: 600 }}>🎬 Movie Admin</div>

      {/* RIGHT */}
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <span>Admin</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
