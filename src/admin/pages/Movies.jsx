import { useEffect, useState } from "react";
import {
  getAllMovies,
  deleteMovie,
  toggleMovieStatus,
} from "../../api/movieAPI";
import MovieForm from "../components/MovieForm";

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  /* ================= FETCH ================= */
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await getAllMovies();
      setAllMovies(data); // dữ liệu gốc
      setMovies(data); // dữ liệu hiển thị
    } catch (err) {
      alert("Không thể tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  /* ================= SEARCH (CÁCH 1) ================= */
  useEffect(() => {
    if (!keyword.trim()) {
      setMovies(allMovies);
    } else {
      const filtered = allMovies.filter((m) =>
        m.title?.toLowerCase().includes(keyword.toLowerCase()),
      );
      setMovies(filtered);
    }
  }, [keyword, allMovies]);

  /* ================= ACTIONS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phim này?")) return;
    await deleteMovie(id);
    fetchMovies();
  };

  const handleToggleStatus = async (id) => {
    await toggleMovieStatus(id);
    fetchMovies();
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <h3 className="mb-3">🎬 Quản lý phim</h3>

      {/* Search + Add */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search */}
        <div className="input-group" style={{ maxWidth: "320px" }}>
          <span className="input-group-text">🔍</span>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Tìm theo tên phim..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Add button */}
        <button
          className="btn btn-success btn-sm"
          onClick={() => {
            setIsEdit(false);
            setSelectedMovie(null);
            setShowForm(true);
          }}
        >
          ➕ Thêm phim
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Tên phim</th>
              <th>Thời lượng</th>
              <th>Ngày phát hành</th>
              <th>Trạng thái</th>
              <th width="220">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.duration} phút</td>
                <td>{m.releaseDate}</td>
                <td>
                  <span
                    className={`badge ${
                      m.status === "SHOWING" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {m.status === "SHOWING" ? "Đang chiếu" : "ngừng chiếu"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setIsEdit(true);
                      setSelectedMovie(m);
                      setShowForm(true);
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(m.id)}
                  >
                    Xoá
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleToggleStatus(m.id)}
                  >
                    Bật / Tắt
                  </button>
                </td>
              </tr>
            ))}

            {movies.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showForm && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Cập nhật phim" : "Thêm phim"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              <div className="modal-body">
                <MovieForm
                  movie={selectedMovie}
                  onSuccess={() => {
                    setShowForm(false);
                    fetchMovies();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieManagement;
