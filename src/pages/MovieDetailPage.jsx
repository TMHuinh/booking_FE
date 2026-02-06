// src/pages/MovieDetailPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Spinner,
  Form,
} from "react-bootstrap";

import { getMovieById } from "../api/movieAPI";
import { getAllCinemas } from "../api/cinemaAPI";
import { getAllRooms } from "../api/roomAPI";
import {
  getShowtimesByMovieId,
  getSeatStatusByShowtime,
  holdSeats,
  releaseSeats,
  confirmBooking,
} from "../api/showtimeAPI";

import { getUserFromToken } from "../utils/auth";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [seatConfirmed, setSeatConfirmed] = useState(false);

  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);

  const SEAT_PRICE = {
    NORMAL: 80000,
    VIP: 150000,
  };

  const selectedSeatDetails = selectedSeats.map((code) => {
    const seat = seats.find((s) => s.seatCode === code);
    const type = seat?.type || "STANDARD";
    const price = SEAT_PRICE[type] || 0;

    return { code, type, price };
  });

  const totalPrice = selectedSeatDetails.reduce(
    (sum, s) => sum + s.price,
    0
  );



  // ================= LOAD MOVIE + CINEMAS + ROOMS =================
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(id);
        const cinemasData = await getAllCinemas();
        const roomsData = await getAllRooms();

        if (!mounted) return;

        setMovie(movieData);
        setCinemas(cinemasData);
        setAllRooms(roomsData);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, [id]);



  // ================= CHỌN RẠP =================
  const handleSelectCinema = (cinemaId) => {
    setSelectedCinema(cinemaId);
    setSelectedRoom("");
    setSelectedShowtime("");
    setRooms([]);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
    setModalOpen(false);

    if (!cinemaId) return;

    setRoomLoading(true);
    const filteredRooms = allRooms.filter((r) => r.cinemaId === cinemaId);
    setRooms(filteredRooms);
    setRoomLoading(false);
  };

  // ================= CHỌN PHÒNG =================
  const handleSelectRoom = async (roomId) => {
    setSelectedRoom(roomId);
    setSelectedShowtime("");
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
    setModalOpen(false);

    if (!roomId) return;

    try {
      const st = await getShowtimesByMovieId(id);
      const filtered = st.filter((s) => s.roomId === roomId);
      setShowtimes(filtered);
    } catch (err) {
      console.error("Lỗi load showtimes:", err);
    }
  };

  // ================= CHỌN SUẤT =================
  const handleSelectShowtime = async (showtimeId) => {
    if (!user) {
      alert("Vui lòng đăng nhập");
      return;
    }

    setSeatConfirmed(false); // 🔥 QUAN TRỌNG
    setSelectedSeats([]);

    setSelectedShowtime(showtimeId);
    if (!showtimeId) return;

    setSeatLoading(true);
    try {
      const seatStatus = await getSeatStatusByShowtime(showtimeId);
      setSeats(seatStatus);
      setModalOpen(true);
    } finally {
      setSeatLoading(false);
    }
  };


  // ================= TOGGLE GHẾ =================
  const toggleSeat = async (seatCode) => {
    if (!user || !selectedShowtime) return;

    const isSelected = selectedSeats.includes(seatCode);

    try {
      if (isSelected) {
        // 1️⃣ release TRƯỚC
        await releaseSeats(selectedShowtime, [seatCode], user.id);

        // 2️⃣ rồi mới update UI
        setSelectedSeats((prev) => prev.filter((s) => s !== seatCode));
      } else {
        // 1️⃣ hold
        await holdSeats(selectedShowtime, [seatCode], user.id);

        // 2️⃣ update UI
        setSelectedSeats((prev) => [...prev, seatCode]);
      }
    } catch (err) {
      alert("Ghế vừa bị người khác giữ 😢");
      console.error(err);
    }
  };


  // ================= XÁC NHẬN GHẾ =================
  // const handleConfirmSeats = async () => {
  //   if (!selectedSeats.length || !user) return;
  //   try {
  //     await confirmBooking(selectedShowtime, selectedSeats, user.id);
  //     alert("🎉 Đặt vé thành công!");
  //     setModalOpen(false);
  //     setSelectedSeats([]);
  //     const updatedSeats = await getSeatStatusByShowtime(selectedShowtime);
  //     setSeats(updatedSeats);
  //   } catch (err) {
  //     console.error("Lỗi xác nhận:", err);
  //     alert("Không thể xác nhận đặt vé");
  //   }
  // };
  const handleConfirmSeats = () => {
    if (!selectedSeats.length) return;

    setSeatConfirmed(true); // đánh dấu đã confirm ghế
    setModalOpen(false);    // đóng modal
  };


  // ================= ĐÓNG MODAL =================
  const handleCloseModal = async () => {
    if (!seatConfirmed && selectedSeats.length && user) {
      await releaseSeats(selectedShowtime, selectedSeats, user.id);
    }
    setSelectedSeats([]);
    setModalOpen(false);
  };


  // ================= HELPER =================
  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.seatCode)) return "#ff6600"; // đang chọn → cam
    if (seat.status === "BOOKED") return "#6c757d"; // đã đặt → xám
    // Nếu ghế đang giữ của người khác → vàng, còn ghế của mình vẫn màu cam (đang chọn)
    if ((seat.status === "HOLDING" || seat.status === "HELD") && !selectedSeats.includes(seat.seatCode))
      return "#ffc107"; // đang giữ → vàng
    if (seat.type === "VIP") return "#dc3545"; // VIP → đỏ
    return "#0d6efd"; // thường → xanh dương
  };

  // ================= RENDER =================
  if (loading)
    return (
      <div className="text-light text-center mt-5">
        <Spinner animation="border" /> Đang tải...
      </div>
    );

  if (!movie)
    return (
      <div className="text-light text-center mt-5">Không tìm thấy phim</div>
    );

  return (
    <div
      style={{
        background: "linear-gradient(to right, #1f1c2c, #282540)",
        minHeight: "100vh",
        padding: "4rem 0",
      }}
    >
      <Container>
        {/* THÔNG TIN PHIM */}
        <Row className="g-5 mb-4">
          <Col md={4}>
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "15px", cursor: "pointer" }}
              onClick={() => window.open(movie.trailerUrl, "_blank")}
            >
              <Card.Img src={movie.posterUrl} />
            </Card>
          </Col>
          <Col md={8} className="text-light">
            <h1 className="fw-bold mb-3" style={{ color: "#ff416c" }}>
              {movie.title}
            </h1>
            <div className="mb-3 d-flex gap-3 flex-wrap">
              <Badge bg="danger">{movie.status}</Badge>
              <span>
                Thời lượng: <strong>{movie.duration} phút</strong>
              </span>
              <span>
                Ngày phát hành:{" "}
                <strong>
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </strong>
              </span>
            </div>
            <p style={{ color: "#e0e0e0" }}>{movie.description}</p>

            {/* Chọn rạp → phòng → suất */}
            <Form.Select
              className="mb-2"
              value={selectedCinema}
              onChange={(e) => handleSelectCinema(e.target.value)}
            >
              <option value="">Chọn rạp</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className="mb-2"
              value={selectedRoom}
              onChange={(e) => handleSelectRoom(e.target.value)}
              disabled={!selectedCinema || roomLoading}
            >
              <option value="">
                {roomLoading ? "Đang tải phòng..." : "Chọn phòng"}
              </option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className="mb-3"
              value={selectedShowtime}
              onChange={(e) => handleSelectShowtime(e.target.value)}
              disabled={!selectedRoom}
            >
              <option value="">Chọn suất chiếu</option>
              {showtimes.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </Form.Select>

            {seatConfirmed && (
              <Button
                className="mt-3"
                style={{
                  background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                  border: "none",
                  borderRadius: "50px",
                  padding: "0.8rem 2rem",
                  fontWeight: "bold",
                }}
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      movie,
                      showtime: showtimes.find(s => s.id === selectedShowtime),
                      selectedSeats,
                      seats, // ❗ CỰC KỲ QUAN TRỌNG
                    },
                  })
                }
              >
                👉 Đặt vé
              </Button>
            )}

          </Col>
        </Row>

        {/* MODAL CHỌN GHẾ */}
        <Modal show={modalOpen} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Chọn ghế</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* CHÚ THÍCH GHẾ */}
            <Row className="mb-4 justify-content-center text-center">
              {[
                { color: "#6c757d", label: "Đã đặt" },
                { color: "#dc3545", label: "VIP" },
                { color: "#0d6efd", label: "Thường" },
                { color: "#ffc107", label: "Đang giữ" },
                { color: "#ff6600", label: "Đang chọn" },
              ].map((item) => (
                <Col xs="auto" key={item.label}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: item.color,
                        borderRadius: "4px",
                      }}
                    />
                    <span>{item.label}</span>
                  </div>
                </Col>
              ))}
            </Row>

            {seatLoading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                {/* Dải màn hình */}
                <Row className="justify-content-center mb-3" key="screen">
                  <Col xs="auto">
                    <div
                      style={{
                        width: "80%",
                        height: "20px",
                        backgroundColor: "#444",
                        borderRadius: "4px",
                        textAlign: "center",
                        color: "#fff",
                        fontSize: "0.8rem",
                        lineHeight: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      MÀN HÌNH
                    </div>
                  </Col>
                </Row>

                {/* Ghế theo hàng */}
                {Array.from(new Set(seats.map((s) => s.seatCode[0])))
                  .sort()
                  .map((row) => (
                    <Row
                      key={`row-${row}`}
                      className="mb-2 justify-content-center"
                    >
                      <Col
                        xs="auto"
                        className="text-white fw-bold d-flex align-items-center"
                        key={`row-label-${row}`}
                      >
                        {row}
                      </Col>

                      {seats
                        .filter((s) => s.seatCode.startsWith(row))
                        .sort(
                          (a, b) =>
                            parseInt(a.seatCode.slice(1)) -
                            parseInt(b.seatCode.slice(1))
                        )
                        .map((seat) => {
                          const isDisabled =
                            seat.status === "BOOKED" ||
                            ((seat.status === "HOLDING" || seat.status === "HELD") &&
                              !selectedSeats.includes(seat.seatCode));

                          return (
                            <Col
                              xs="auto"
                              key={`${selectedShowtime}-${seat.seatCode}`}
                              className="mb-2"
                            >
                              <Button
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: getSeatColor(seat),
                                  borderColor: "#444",
                                  padding: 0,
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  transition: "transform 0.1s",
                                }}
                                // disable nếu ghế đã BOOKED hoặc ghế đang HOLDING mà không phải ghế mình giữ
                                disabled={
                                  seat.status === "BOOKED" ||
                                  ((seat.status === "HOLDING" || seat.status === "HELD") &&
                                    !selectedSeats.includes(seat.seatCode))
                                }
                                onClick={() => toggleSeat(seat.seatCode)}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                title={`Ghế ${seat.seatCode} - ${seat.type} ${selectedSeats.includes(seat.seatCode)
                                  ? "(Đang chọn)"
                                  : seat.status === "BOOKED"
                                    ? "(Đã đặt)"
                                    : seat.status === "HOLDING" || seat.status === "HELD"
                                      ? "(Đang giữ)"
                                      : ""
                                  }`}
                              >
                                {seat.seatCode}
                              </Button>

                            </Col>
                          );
                        })}
                    </Row>
                  ))}
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between align-items-center">
            {/* GIÁ */}
            <div className="fw-bold fs-5">
              💰 Tổng tiền:{" "}
              <span style={{ color: "#ff416c" }}>
                {totalPrice.toLocaleString()} VND
              </span>
            </div>

            {/* NÚT */}
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button
                variant="success"
                onClick={handleConfirmSeats}
                disabled={!selectedSeats.length}
              >
                Xác nhận ({selectedSeats.length})
              </Button>
            </div>
          </Modal.Footer>

        </Modal>
      </Container>
    </div >
  );
}
