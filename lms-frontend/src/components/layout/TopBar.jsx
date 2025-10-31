import React from "react";
import bkLogo from "../../assets/imgs/logoBK.png";
import { Link } from "react-router-dom";

export default function TopBar({ user }) {
  const name = user?.name || user?.username || "Student User";
  const role = user?.role || "student";
  const avatar =
    user?.avatar ||
    `https://i.pravatar.cc/80?u=${encodeURIComponent(user?.username || user?.name || "bk")}`;

  return (
    <header className="bk-topbar">
      <div className="inner topbar-rail">
        <div className="left-rail">
          <img className="bk-logo" src={bkLogo} alt="BK Logo" />
          <div className="bk-title">Trường Đại học Bách Khoa Thành phố Hồ Chí Minh</div>
        </div>

        {/* 🔁 Link sang trang Profile Management */}
        <Link
          to="/app/profile"
          className="user-card"
          aria-label="Open Profile Management"
          title="Open Profile"
        >
          <div className="user-card__meta">
            <div className="user-card__name">{name}</div>
            <div className="user-card__role">{role}</div>
          </div>
          <img className="user-card__avatar" src={avatar} alt={`${name} avatar`} />
        </Link>
      </div>
    </header>
  );
}
