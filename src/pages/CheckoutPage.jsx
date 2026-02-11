import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
} from "react-bootstrap";
import { createBooking, confirmBooking } from "../api/bookingAPI";
import { getUserFromToken } from "../utils/auth";


const VIP_EXTRA = 55000;

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const movie = state?.movie;
  const showtime = state?.showtime;
  const selectedSeats = state?.selectedSeats || [];
  const seats = state?.seats || [];

  if (!movie || !showtime || !selectedSeats.length) {
    return (
      <div className="text-center mt-5">
        <h4>❌ Không có dữ liệu để thanh toán</h4>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const seatTypeMap = {};
  seats.forEach((s) => {
    seatTypeMap[s.seatCode] = s.type;
  });

  const seatDetails = selectedSeats.map((code) => {
    const type = seatTypeMap[code] || "STANDARD";
    const price = type === "VIP" ? showtime.price + VIP_EXTRA : showtime.price;
    return { code, type, price };
  });

  const totalPrice = seatDetails.reduce((sum, s) => sum + s.price, 0);

  const handleCheckout = async () => {
  setLoading(true);
  try {
    const user = getUserFromToken();

    const res = await createBooking(showtime.id, {
      userId: user.id,
      seats: selectedSeats,
    });

    const booking = res.data.result;

    await confirmBooking(booking.id, "payment123", paymentMethod);

    alert("🎉 Thanh toán thành công!");
    navigate("/my-bookings");
  } catch (err) {
    console.error(err);
    alert("❌ Thanh toán thất bại");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "4rem 0",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white fs-5 fw-bold">
                🛒 Thanh toán đơn hàng
              </Card.Header>
              <Card.Body>
                {/* Thông tin phim */}
                <Card className="mb-3 shadow-sm">
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img src={movie.posterUrl} />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Text>
                          ⏰ {new Date(showtime.startTime).toLocaleString()}
                        </Card.Text>
                        <Card.Text>
                          💰 Giá cơ bản: {showtime.price.toLocaleString()} VND
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>

                {/* Danh sách ghế */}
                <Card className="mb-3 shadow-sm p-3">
                  <h6>🎟️ Ghế đã chọn:</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {seatDetails.map((s) => (
                      <Badge
                        key={s.code}
                        bg={s.type === "VIP" ? "danger" : "secondary"}
                        className="p-2"
                      >
                        {s.code} – {s.type} – {s.price.toLocaleString()} VND
                      </Badge>
                    ))}
                  </div>
                  <h5 className="mt-3">
                    Tổng tiền:{" "}
                    <span style={{ color: "#ff416c" }}>
                      {totalPrice.toLocaleString()} VND
                    </span>
                  </h5>
                </Card>

                {/* Phương thức thanh toán */}
                <Card className="mb-3 shadow-sm p-3">
                  <h6>💳 Chọn phương thức thanh toán:</h6>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CASH">Tiền mặt</option>
                    <option value="MOMO">Momo</option>
                    <option value="VNPAY">VNPAY</option>
                  </Form.Select>
                </Card>

                {/* Nút thanh toán */}
                <div className="text-end">
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading}
                    style={{
                      background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                      border: "none",
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : "💳 Thanh toán"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
