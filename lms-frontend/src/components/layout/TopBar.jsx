// src/components/layout/TopBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import bkLogo from "../../assets/imgs/logoBK.png";

export default function TopBar({ user, onLogout }) {
  const avatar =
    user?.avatar ||
    `https://i.pravatar.cc/80?u=${encodeURIComponent(
      user?.username || user?.name || "bk"
    )}`;

  return (
    <header className="bk-topbar">
      <div className="inner topbar-rail">
        <div className="left-rail">
          <img className="bk-logo" src={bkLogo} alt="BK Logo" />
          <div className="bk-title">
            Trường Đại học Bách Khoa Thành phố Hồ Chí Minh
          </div>
        </div>

        <div className="d-flex align-items-center" style={{ gap: 12 }}>
          <Link
            to="/app/profile"
            className="user-card"
            aria-label="Open Profile"
          >
            <div className="user-card__meta">
              <div className="user-card__name">
                {user?.name || user?.username || "Student User"}
              </div>
              <div className="user-card__role">
                {user?.role || "student"}
              </div>
            </div>
            <img
              className="user-card__avatar"
              src={avatar}
              alt={user?.name || "User"}
            />
          </Link>

          {onLogout && (
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-1" />
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
