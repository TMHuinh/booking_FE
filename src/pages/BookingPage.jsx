import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { confirmBooking } from "../api/showtimeAPI";
import { getUserFromToken } from "../utils/auth";

const VIP_EXTRA = 55000;

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = getUserFromToken();

  // ❗ SAFE DEFAULT
  const movie = state?.movie;
  const showtime = state?.showtime;
  const selectedSeats = state?.selectedSeats || [];
  const seats = state?.seats || [];

  if (!movie || !showtime || !selectedSeats.length) {
    return (
      <div className="text-center mt-5">
        <h4>❌ Dữ liệu booking không hợp lệ</h4>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  // map seatCode -> seatType
  const seatTypeMap = {};
  seats.forEach((s) => {
    seatTypeMap[s.seatCode] = s.type;
  });

  const seatDetails = selectedSeats.map((code) => {
    const type = seatTypeMap[code] || "STANDARD";
    const price =
      type === "VIP"
        ? showtime.price + VIP_EXTRA
        : showtime.price;

    return { code, type, price };
  });

  const totalPrice = seatDetails.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const handleGoToCheckout = () => {
    navigate("/checkout", {
      state: {
        movie,
        showtime,
        selectedSeats,
        seats,
        totalPrice,
      },
    });
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #141e30, #243b55)",
        padding: "4rem 0",
      }}
    >
      <Container>
        <Row className="g-4">
          {/* PHIM */}
          <Col md={4}>
            <Card className="border-0 shadow">
              <Card.Img src={movie.posterUrl} />
              <Card.Body>
                <h5 className="fw-bold">{movie.title}</h5>
                <p className="mb-1">
                  ⏰ {new Date(showtime.startTime).toLocaleString()}
                </p>
                <p className="mb-0">
                  💰 Giá cơ bản:{" "}
                  <strong>
                    {showtime.price.toLocaleString()} VND
                  </strong>
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* CHECKOUT */}
          <Col md={8}>
            <Card className="shadow border-0">
              <Card.Header className="fw-bold fs-5">
                🧾 Thanh toán
              </Card.Header>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  👤 Người đặt: <strong>{user?.email}</strong>
                </ListGroup.Item>

                <ListGroup.Item>
                  🎟️ Ghế:
                  <div className="mt-2 d-flex gap-2 flex-wrap">
                    {seatDetails.map((s) => (
                      <Badge
                        key={s.code}
                        bg={s.type === "VIP" ? "danger" : "primary"}
                      >
                        {s.code} – {s.type}
                      </Badge>
                    ))}
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  💵 Chi tiết giá:
                  <ul className="mt-2 mb-0">
                    {seatDetails.map((s) => (
                      <li key={s.code}>
                        Ghế {s.code} ({s.type}) –{" "}
                        {s.price.toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>

                <ListGroup.Item className="fw-bold fs-5">
                  🧮 Tổng tiền:{" "}
                  <span style={{ color: "#ff416c" }}>
                    {totalPrice.toLocaleString()} VND
                  </span>
                </ListGroup.Item>
              </ListGroup>

              <Card.Footer className="text-end">
                <Button
                  size="lg"
                  style={{
                    background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                    border: "none",
                  }}
                  onClick={handleGoToCheckout}
                >
                  💳 Tiếp tục thanh toán
                </Button>

              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
