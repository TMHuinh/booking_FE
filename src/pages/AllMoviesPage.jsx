import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../api/movieAPI";
import { getAllGenres } from "../api/genreAPI";

export default function AllMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // SHOWING / COMING_SOON
  const [genreFilter, setGenreFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  // fetch genres + movies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, genreData] = await Promise.all([
          getAllMovies(),
          getAllGenres(),
        ]);
        setMovies(movieData);
        setGenres(genreData);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // filter movies
  const filtered = movies
    .filter((m) => (statusFilter ? m.status === statusFilter : true))
    .filter((m) => (genreFilter ? m.genreId === genreFilter : true))
    .filter((m) =>
      search.trim() === "" || m.title.toLowerCase().includes(search.trim().toLowerCase())
    );

  // pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedMovies = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll lên đầu khi chuyển trang
  };

  if (loading)
    return (
      <div className="text-center mt-5 text-light">
        <Spinner animation="border" variant="light" /> Đang tải...
      </div>
    );

  return (
    <div style={{ background: "#1f1c2c", minHeight: "100vh", padding: "1rem 0" }}>
      <Container>
        <h1 className="text-warning mb-4">Tất cả phim</h1>

        {/* ===== FILTERS ===== */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Tìm kiếm theo tên phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "50px" }}
            />
          </Col>

          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderRadius: "50px" }}
            >
              <option value="">-- Tình trạng --</option>
              <option value="SHOWING">Đang chiếu</option>
              <option value="COMING_SOON">Sắp chiếu</option>
            </Form.Select>
          </Col>

          <Col md={5}>
            <Form.Select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{ borderRadius: "50px" }}
            >
              <option value="">-- Chọn thể loại --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* ===== MOVIE LIST ===== */}
        {filtered.length === 0 ? (
          <div className="text-center text-light">Không tìm thấy phim</div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {paginatedMovies.map((movie) => (
              <Col key={movie.id}>
                <Card
                  className="shadow-lg border-0 h-100"
                  style={{
                    borderRadius: "15px",
                    cursor: "pointer",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Card.Img
                    variant="top"
                    src={movie.posterUrl}
                    style={{
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "15px 15px 0 0",
                    }}
                  />
                  <Card.Body style={{ background: "#2b293b" }}>
                    <Card.Title className="text-light">{movie.title}</Card.Title>
                    <Badge bg="danger" className="mb-2">
                      {movie.status}
                    </Badge>
                    <Card.Text className="text-light" style={{ fontSize: "0.9rem" }}>
                      {movie.description.length > 60
                        ? movie.description.slice(0, 60) + "..."
                        : movie.description}
                    </Card.Text>
                    <Button
                      style={{
                        background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                        border: "none",
                        borderRadius: "50px",
                        width: "100%",
                      }}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </Container>
    </div>
  );
}
