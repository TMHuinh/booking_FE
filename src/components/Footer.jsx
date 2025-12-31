import { Row, Col, Nav, Container } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white w-100" style={{ background: 'linear-gradient(180deg, #111, #000)' }}>
      {/* Full width padding bằng div */}
      <div className="w-100 px-5 py-5">
        <Row className="mb-5 text-start">
          {/* Logo + Description */}
          <Col md={4} sm={12} className="mb-4">
            <h3 className="fw-bold text-warning">FilmSpot</h3>
            <p className="text-light">
              Nền tảng đặt vé xem phim nhanh chóng, tiện lợi và an toàn. Cập nhật đầy đủ lịch chiếu và trailer mới nhất mỗi ngày.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} sm={12} className="mb-4">
            <h5 className="fw-bold text-warning">Liên kết nhanh</h5>
            <Nav className="flex-column text-start">
              <Nav.Link href="/" className="text-light p-0 mb-1">Trang chủ</Nav.Link>
              <Nav.Link href="/movies" className="text-light p-0 mb-1">Phim đang chiếu</Nav.Link>
              <Nav.Link href="/genres" className="text-light p-0 mb-1">Thể loại phim</Nav.Link>
              <Nav.Link href="/contact" className="text-light p-0 mb-1">Liên hệ</Nav.Link>
            </Nav>
          </Col>

          {/* Contact */}
          <Col md={4} sm={12} className="mb-4 text-start">
            <h5 className="fw-bold text-warning">Liên hệ</h5>
            <p className="text-light mb-1">Email: support@moviebooking.com</p>
            <p className="text-light mb-2">Hotline: 1900 1234</p>
            <div className="d-flex gap-2 mt-2">
              <a href="#" className="btn btn-warning btn-sm rounded-circle p-2 shadow-sm"><FaFacebookF /></a>
              <a href="#" className="btn btn-warning btn-sm rounded-circle p-2 shadow-sm"><FaTwitter /></a>
              <a href="#" className="btn btn-warning btn-sm rounded-circle p-2 shadow-sm"><FaInstagram /></a>
              <a href="#" className="btn btn-warning btn-sm rounded-circle p-2 shadow-sm"><FaYoutube /></a>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary opacity-25" />

        <p className="text-center text-light mb-0 py-3">
          © 2025 Movie Booking | All rights reserved
        </p>
      </div>
    </footer>
  );
}
