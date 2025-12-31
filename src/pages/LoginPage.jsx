import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api/authAPI"; // import API

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validators = {
    email: (val) =>
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val.trim()) || "Email không hợp lệ",
    password: (val) =>
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(val) ||
      "Mật khẩu ít nhất 6 ký tự, gồm chữ và số",
  };

  const handleBlur = (field, value) => {
    if (!validators[field]) return;
    const valid = validators[field](value);
    setErrors((prev) => ({
      ...prev,
      [field]: typeof valid === "string" ? valid : null,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const val = { email, password }[field];
      if (!validators[field]) return;
      const valid = validators[field](val);
      if (typeof valid === "string") newErrors[field] = valid;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Call API
    try {
      setLoading(true);
      const data = await login({ email, password }); // gửi đúng payload
      console.log("Đăng nhập thành công:", data);
      alert("Đăng nhập thành công!");
      window.location.href = "/"; // chuyển trang chính
    } catch (err) {
      console.error("Đăng nhập thất bại:", err.response?.data || err.message);
      alert("Đăng nhập thất bại! Kiểm tra email/mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page d-flex justify-content-center align-items-center p-5"
      style={{ minHeight: "80vh", background: "linear-gradient(135deg, #1f1c2c, #928dab)" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden", background: "rgba(0,0,0,0.85)" }}>
              <Card.Body className="p-4">
                <h2 className="text-center fw-bold mb-4 text-warning">Chào mừng trở lại</h2>
                <p className="text-center text-light mb-4">Đăng nhập để tiếp tục trải nghiệm FilmSpot</p>

                <Form onSubmit={handleLogin}>
                  {/* Email */}
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-light">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email", email)}
                      isInvalid={!!errors.email}
                      style={{ borderRadius: "50px" }}
                    />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="text-light">Mật khẩu</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur("password", password)}
                        isInvalid={!!errors.password}
                        style={{ borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px" }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px", borderLeft: "none", backgroundColor: "white" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-bold"
                    style={{ background: "linear-gradient(90deg, #ff416c, #ff4b2b)", border: "none", borderRadius: "50px", padding: "0.75rem", transition: "0.3s", marginTop: 15 }}
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <a href="#" className="text-decoration-none text-light">Quên mật khẩu?</a>
                </div>

                <div className="text-center mt-2">
                  <span className="text-light">Chưa có tài khoản? </span>
                  <a href="/register" className="text-warning fw-bold text-decoration-none">Đăng ký</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
