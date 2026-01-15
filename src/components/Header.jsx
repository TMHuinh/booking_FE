import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

// Hàm parse JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export default function Header({ search, setSearch }) {
  const [user, setUser] = useState(null);

  // Lấy user từ accessToken
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // phải là JWT string
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          email: decoded.sub,
          role: decoded.role,
          fullName: decoded.fullName || decoded.sub,
        });
      } else {
        console.error("Token không hợp lệ");
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}

    localStorage.removeItem("accessToken");

    // 🔥 BẮT BUỘC
    setUser(null);

    navigate("/login", { replace: true });
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-secondary text-light py-1 small">
        <Container className="d-flex justify-content-between align-items-center">
          <div>📞 1900 1234 | ✉ support@filmspot.com</div>
          <div className="d-flex gap-3">
            <a href="#" className="text-light text-decoration-none">
              Khuyến mãi
            </a>
            <a href="#" className="text-light text-decoration-none">
              Tin tức
            </a>
            <a href="#" className="text-light text-decoration-none">
              Hỗ trợ
            </a>
            <a href="#" className="text-light">
              <FaFacebookF />
            </a>
            <a href="#" className="text-light">
              <FaTwitter />
            </a>
            <a href="#" className="text-light">
              <FaInstagram />
            </a>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            FilmSpot
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/">Trang chủ</Nav.Link>
              <Nav.Link href="/movies">Phim</Nav.Link>
              <Nav.Link href="/cinemas">Rạp</Nav.Link>
            </Nav>

            <Form className="d-flex me-3">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Tìm phim..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="danger">Tìm</Button>
              </InputGroup>
            </Form>

            {/* User Menu */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  {user.fullName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">Hồ sơ</Dropdown.Item>
                  <Dropdown.Item href="/tickets">Vé đã mua</Dropdown.Item>
                  {user.role === "ADMIN" && (
                    <Dropdown.Item href="/admin">Quản trị</Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button variant="outline-light" href="/login">
                Đăng nhập
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
