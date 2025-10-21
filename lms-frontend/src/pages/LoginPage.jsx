// src/components/LoginPage.jsx
import React, { useState } from 'react';
import bkLogo from "../assets/imgs/logoBK.png";

const TEST_USERS = [
  { username: "student", password: "123456", name: "Student User" },
  { username: "teacher", password: "123456", name: "Teacher User" },
  { username: "admin",   password: "admin123", name: "Admin User" },
];

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const u = TEST_USERS.find((t) => t.username === username && t.password === password);
    if (u) { setErr(""); onLogin?.({ username: u.username, name: u.name, role: u.username }); }
    else setErr("Sai tài khoản hoặc mật khẩu (gợi ý: student/123456, teacher/123456, admin/admin123)");
  };

  return (
    <div className="app-shell">
      <header className="bk-topbar">
        <div className="inner d-flex align-items-center" style={{ gap: 12 }}>
          <img className="bk-logo" src={bkLogo} alt="BK Logo" />
          <div className="bk-title">Trường Đại học Bách Khoa Thành phố Hồ Chí Minh</div>
        </div>
      </header>

      <main className="bk-stage">
        <div className="stage-inner">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="login-card">
                <div className="login-heading">Đăng nhập bằng tài khoản</div>
                <div className="login-sub">Truy cập hệ thống LMS của Trường Đại học Bách Khoa.</div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tài khoản</label>
                    <input
                      id="username" type="text" className="form-control"
                      placeholder="Nhập tài khoản (vd: student)"
                      value={username} onChange={(e)=>setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <div className="d-flex gap-2">
                      <input
                        id="password" type={showPwd ? "text" : "password"}
                        className="form-control" placeholder="Nhập mật khẩu"
                        value={password} onChange={(e)=>setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        style={{borderRadius:14}}
                        onClick={()=>setShowPwd(v=>!v)}
                        aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPwd ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                  </div>

                    <div className="d-flex justify-content-end mt-2">
                        <a className="link-muted" href="#!">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="btn btn-bk w-100 mt-2">
                        Đăng nhập
                    </button>

                  {err && <div className="mt-3 text-danger small">{err}</div>}

                  <div className="mt-3 small text-muted">
                    Tài khoản thử: <code>student/123456</code>, <code>teacher/123456</code>, <code>admin/admin123</code>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block"></div>
          </div>
        </div>
      </main>

      <footer className="bk-footer">
        <div className="inner">
          © {new Date().getFullYear()} Trường Đại học Bách Khoa – Đại học Quốc gia TP.HCM
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
