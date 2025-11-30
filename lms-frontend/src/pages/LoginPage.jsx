// src/pages/LoginPage.jsx
import React, { useState } from "react";
import bkLogo from "../assets/imgs/logoBK.png";

const API_BASE = "http://localhost:4000"; 

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!username || !password) {
      setErr("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message ||
            "Sai tài khoản hoặc mật khẩu (hãy kiểm tra lại users.json)."
        );
      }

      const user = await res.json();
      onLogin?.(user);
    } catch (error) {
      setErr(error.message || "Đăng nhập thất bại, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="bk-topbar">
        <div className="inner d-flex align-items-center" style={{ gap: 12 }}>
          <img className="bk-logo" src={bkLogo} alt="BK Logo" />
          <div className="bk-title">
            Trường Đại học Bách Khoa Thành phố Hồ Chí Minh
          </div>
        </div>
      </header>

      <main className="bk-stage">
        <div className="stage-inner">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="login-card">
                <div className="login-heading">Đăng nhập bằng tài khoản</div>
                <div className="login-sub">
                  Truy cập hệ thống LMS của Trường Đại học Bách Khoa.
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Tài khoản
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control"
                      placeholder="Nhập tài khoản (vd: student)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password" className="form-label">
                      Mật khẩu
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        style={{ borderRadius: 14 }}
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPwd ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-2">
                    <a className="link-muted" href="#!">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-bk w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>

                  {err && (
                    <div className="mt-3 text-danger small">
                      {err}
                    </div>
                  )}

                  <div className="mt-3 small text-muted">
                    Tài khoản demo phải trùng với{" "}
                    <code>users.json</code> trên server (ví dụ:
                    <code>student/123456</code>, <code>teacher/123456</code>,
                    <code>admin/admin123</code> nếu bạn cấu hình như vậy).
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">{/* background */}</div>
          </div>
        </div>
      </main>

      <footer className="bk-footer">
        <div className="inner">
          © {new Date().getFullYear()} Trường Đại học Bách Khoa – Đại học
          Quốc gia TP.HCM
        </div>
      </footer>
    </div>
  );
}
