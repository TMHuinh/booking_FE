import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../api/authAPI"; // import API

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validators = {
        name: (val) => /^[a-zA-ZÀ-ỹ\s]{2,}$/.test(val.trim()) || "Họ tên không hợp lệ",
        email: (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val.trim()) || "Email không hợp lệ",
        password: (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(val) || "Mật khẩu ít nhất 6 ký tự, gồm chữ và số",
        phone: (val) => /^\d{10}$/.test(val) || "SĐT phải 10 chữ số",
    };

    const handleBlur = (field, value) => {
        if (!validators[field]) return;
        const valid = validators[field](value);
        setErrors((prev) => ({
            ...prev,
            [field]: typeof valid === "string" ? valid : null,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate
        const newErrors = {};
        Object.keys(validators).forEach((field) => {
            const val = { name, email, password, phone }[field];
            if (!validators[field]) return;
            const valid = validators[field](val);
            if (typeof valid === "string") newErrors[field] = valid;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // Call API với key đúng fullName
        try {
            setLoading(true);
            const data = await register({ fullName: name, email, password, phone });
            console.log("Đăng ký thành công:", data);
            alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
            window.location.href = "/login"; // redirect
        } catch (err) {
            console.error("Lỗi đăng ký:", err.response?.data || err.message);
            alert("Đăng ký thất bại! " + (err.response?.data?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="register-page d-flex justify-content-center align-items-center p-5"
            style={{ minHeight: "80vh", background: "linear-gradient(135deg, #1f1c2c, #928dab)" }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden", background: "rgba(0,0,0,0.85)" }}>
                            <Card.Body className="p-4">
                                <h2 className="text-center fw-bold mb-4 text-warning">Tạo tài khoản mới</h2>
                                <Form onSubmit={handleRegister}>
                                    {/* Họ tên */}
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label className="text-light">Họ tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={() => handleBlur("name", name)}
                                            isInvalid={!!errors.name}
                                            style={{ borderRadius: "50px" }}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>

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
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Mật khẩu */}
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

                                    {/* SĐT */}
                                    <Form.Group className="mb-3" controlId="formPhone">
                                        <Form.Label className="text-light">SĐT</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onBlur={() => handleBlur("phone", phone)}
                                            isInvalid={!!errors.phone}
                                            style={{ borderRadius: "50px" }}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100 fw-bold"
                                        style={{ background: "linear-gradient(90deg, #ff416c, #ff4b2b)", border: "none", borderRadius: "50px", padding: "0.75rem", transition: "0.3s", marginTop:15 }}
                                        disabled={loading}
                                    >
                                        {loading ? "Đang xử lý..." : "Đăng ký"}
                                    </Button>
                                </Form>

                                <div className="text-center mt-3 text-light">
                                    Bạn đã có tài khoản? <a href="/login" className="text-warning fw-bold">Đăng nhập</a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
