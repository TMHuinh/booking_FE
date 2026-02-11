// src/pages/MyBookingsPage.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { getBookingsByUser } from "../api/bookingAPI";
import { getUserFromToken } from "../utils/auth";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      const user = getUserFromToken();
      if (!user?.id) {
        setError("Bạn chưa đăng nhập");
        setLoading(false);
        return;
      }

      try {
        const res = await getBookingsByUser(user.id);
        setBookings(res.data.result || []);
      } catch (err) {
        console.error(err);
        setError("❌ Không thể tải vé của bạn");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải vé của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p>{error}</p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center mt-5">
        <h4>🎟️ Bạn chưa mua vé nào.</h4>
      </div>
    );
  }

  return (
    <Container style={{ minHeight: "100vh", padding: "4rem 0" }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h3 className="mb-4">🎟️ Vé đã mua của tôi</h3>

          {bookings.map((booking) => (
            <Card key={booking.id} className="mb-3 shadow-sm">
              <Card.Header className="bg-primary text-white">
                Booking ID: {booking.id} – {booking.status}
              </Card.Header>
              <Card.Body>
                <p>
                  <strong>Ghế:</strong>{" "}
                  {booking.seats.map((s) => (
                    <Badge key={s} bg="secondary" className="me-1">
                      {s}
                    </Badge>
                  ))}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  <span style={{ color: "#ff416c" }}>
                    {booking.totalAmount?.toLocaleString()} VND
                  </span>
                </p>
                <p>
                  <strong>Payment ID:</strong> {booking.paymentId}
                </p>
                <p>
                  <strong>Thời gian đặt:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
