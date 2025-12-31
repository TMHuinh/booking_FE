import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getShowingMovies } from "../api/movieAPI";
import { getAllGenres } from "../api/genreAPI";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, genreData] = await Promise.all([
          getShowingMovies(),
          getAllGenres()
        ]);

        setMovies(movieData);
        setFilteredMovies(movieData);
        setGenres(genreData);
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map genreId -> genreName
  const genreMap = genres.reduce((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});

  const handleFilterGenre = (genreId) => {
    setSelectedGenre(genreId);
    const filtered = movies.filter((m) => m.genreId === genreId);
    setFilteredMovies(filtered);
  };

  const handleResetFilter = () => {
    setSelectedGenre(null);
    setFilteredMovies(movies);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="text-white text-center py-5 hero-banner">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Đặt vé xem phim online</h1>
          <p className="lead mb-4">Nhanh chóng – tiện lợi – an toàn</p>
          <Button className="fw-bold hero-btn">Đặt vé ngay</Button>
        </Container>
      </div>

      <Container className="my-5">
        {/* ===== GENRE FILTER ===== */}
        <h4 className="mb-3 fw-bold">🎯 Thể loại phim</h4>
        <div className="mb-4 d-flex flex-wrap gap-2">
          <Badge
            bg={!selectedGenre ? "primary" : "secondary"}
            className="p-2 fs-6 genre-badge"
            onClick={handleResetFilter}
          >
            Tất cả
          </Badge>

          {genres.map((g) => (
            <Badge
              key={g.id}
              bg={selectedGenre === g.id ? "danger" : "secondary"}
              className="p-2 fs-6 genre-badge"
              onClick={() => handleFilterGenre(g.id)}
            >
              {g.name}
            </Badge>
          ))}
        </div>

        {/* ===== MOVIE LIST ===== */}
        <h3 className="mb-4 fw-bold">🎞️ Phim đang chiếu</h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <Row>
            {filteredMovies.map((movie) => (
              <Col md={3} sm={6} xs={12} className="mb-4" key={movie.id}>
                <Card className="movie-card shadow-lg border-0">
                  <Link
                    to={`/movie/${movie.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card.Img
                      src={
                        movie.posterUrl ||
                        movie.poster ||
                        "https://via.placeholder.com/300x450"
                      }
                      className="movie-poster"
                    />

                    <div className="overlay">
                      <div className="overlay-buttons">
                        <Button className="btn-book">Đặt vé</Button>
                        <Button className="btn-trailer">Xem Trailer</Button>
                      </div>
                    </div>

                    <Card.Body>
                      <Card.Title className="fw-bold text-truncate text-dark">
                        {movie.title}
                      </Card.Title>

                      <Card.Text className="text-muted mb-1">
                        Thể loại:{" "}
                        <strong>
                          {genreMap[movie.genreId] || "Đang cập nhật"}
                        </strong>
                      </Card.Text>

                      <Card.Text className="mb-0">
                        Trạng thái:{" "}
                        <Badge
                          bg={movie.status === "SHOWING" ? "success" : "secondary"}
                        >
                          {movie.status}
                        </Badge>
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* CSS giữ nguyên */}
      <style>{`
        .hero-banner {
          height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.5);
        }
        .hero-banner h1, .hero-banner p, .hero-btn {
          position: relative;
          z-index: 2;
        }
        .hero-btn {
          background: linear-gradient(90deg, #ff416c, #ff4b2b);
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-size: 1.2rem;
        }

        .movie-card {
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .movie-poster {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
        }
        .movie-card:hover .overlay {
          background: rgba(0,0,0,0.5);
        }

        .overlay-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0;
        }
        .movie-card:hover .overlay-buttons {
          opacity: 1;
        }

        .btn-book {
          background: linear-gradient(90deg, #ff416c, #ff4b2b);
          color: white;
          border: none;
          border-radius: 30px;
        }

        .btn-trailer {
          background: rgba(255,255,255,0.9);
          color: #333;
          border: none;
          border-radius: 30px;
        }

        .genre-badge {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
