import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, Card, Spinner } from "react-bootstrap";
import { getMovieById } from "../api/movieAPI";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load movie từ API nếu chưa có
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết phim:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  if (loading)
    return (
      <div className="text-light text-center mt-5">
        <Spinner animation="border" variant="light" /> Đang tải...
      </div>
    );

  if (!movie)
    return <div className="text-light text-center mt-5">Không tìm thấy phim</div>;

  const handleBookNow = () => {
    navigate(`/booking/${movie.id}`, { state: { movie } });
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #1f1c2c, #282540)",
        minHeight: "100vh",
        padding: "4rem 0",
      }}
    >
      <Container>
        <Row className="align-items-center g-5">
          <Col md={4}>
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s",
              }}
              onClick={() => window.open(movie.trailerUrl, "_blank")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Card.Img src={movie.posterUrl} style={{ borderRadius: "15px" }} />
            </Card>
          </Col>

          <Col md={8} className="text-light">
            <h1 className="fw-bold mb-3" style={{ color: "#ff416c" }}>
              {movie.title}
            </h1>

            <div className="mb-3 d-flex flex-wrap align-items-center gap-3">
              <Badge bg="danger" className="p-2 fs-6">
                {movie.status}
              </Badge>
              <span>
                Thời lượng: <strong>{movie.duration} phút</strong>
              </span>
              <span>
                Ngày phát hành:{" "}
                <strong>{new Date(movie.releaseDate).toLocaleDateString()}</strong>
              </span>
              <span>
                Thể loại: <strong>{movie.genreName || movie.genreId}</strong>
              </span>
            </div>

            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#e0e0e0" }}>
              {movie.description}
            </p>

            {/* Nút luôn hiển thị sau khi movie load */}
            <div className="mt-4 d-flex gap-3 flex-wrap">
              <Button
                style={{
                  background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                  border: "none",
                  borderRadius: "50px",
                  padding: "0.8rem 2rem",
                  fontWeight: "bold",
                  boxShadow: "0 5px 15px rgba(255,75,43,0.4)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={handleBookNow}
              >
                Đặt vé ngay
              </Button>

              <Button
                variant="outline-light"
                onClick={() => window.open(movie.trailerUrl, "_blank")}
                style={{ borderRadius: "50px", padding: "0.6rem 1.5rem" }}
              >
                Xem trailer
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
