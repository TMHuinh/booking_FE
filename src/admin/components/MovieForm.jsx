import { useEffect, useState } from "react";
import { createMovie, updateMovie } from "../../api/movieAPI";
import { getAllGenres } from "../../api/genreAPI";

function MovieForm({ movie, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    releaseDate: "",
    trailerUrl: "",
    genreId: "",
    status: "SHOWING",
  });

  const [genres, setGenres] = useState([]);
  const [posterFile, setPosterFile] = useState(null);

  const isEdit = !!movie;

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        duration: movie.duration || "",
        releaseDate: movie.releaseDate || "",
        trailerUrl: movie.trailerUrl || "",
        genreId: movie.genre?.id || "",
        status: movie.status || "SHOWING",
      });
    }
  }, [movie]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch {
        alert("Không thể tải thể loại");
      }
    };
    fetchGenres();
  }, []);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (posterFile) {
      data.append("poster", posterFile);
    }

    try {
      if (isEdit) {
        await updateMovie(movie.id, data);
        alert("Cập nhật phim thành công");
      } else {
        await createMovie(data);
        alert("Thêm phim thành công");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* TITLE */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Tên phim</label>
          <input
            className="form-control"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {/* DURATION */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Thời lượng (phút)</label>
          <input
            type="number"
            className="form-control"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            required
          />
        </div>

        {/* RELEASE DATE */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Ngày phát hành</label>
          <input
            type="date"
            className="form-control"
            value={formData.releaseDate}
            onChange={(e) =>
              setFormData({ ...formData, releaseDate: e.target.value })
            }
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="col-12">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* TRAILER */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Trailer URL</label>
          <input
            className="form-control"
            value={formData.trailerUrl}
            onChange={(e) =>
              setFormData({ ...formData, trailerUrl: e.target.value })
            }
          />
        </div>

        {/* GENRE */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Thể loại</label>
          <select
            className="form-select"
            value={formData.genreId}
            onChange={(e) =>
              setFormData({ ...formData, genreId: e.target.value })
            }
            required
          >
            <option value="">-- Chọn --</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Trạng thái</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="SHOWING">Đang chiếu</option>
            <option value="STOPPED">Ngừng chiếu</option>
          </select>
        </div>

        {/* POSTER */}
        <div className="col-12">
          <label className="form-label fw-semibold">Poster phim</label>
          <div className="input-group">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files[0])}
            />
          </div>
          {posterFile && (
            <small className="text-success">Đã chọn: {posterFile.name}</small>
          )}
        </div>

        {/* SUBMIT */}
        <div className="col-12 mt-3">
          <button className="btn btn-primary w-100 fw-semibold">
            {isEdit ? "💾 Cập nhật phim" : "➕ Thêm phim"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default MovieForm;
