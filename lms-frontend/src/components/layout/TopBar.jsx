import React from "react";
import bkLogo from "../../assets/imgs/logoBK.png";
import { Link } from "react-router-dom";

export default function TopBar({ user }) {
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

        <Link to="/app/user-management" className="user-card" aria-label="Open User Management">
          <div className="user-card__meta">
            <div className="user-card__name">{user?.name || user?.username || "Student User"}</div>
            <div className="user-card__role">{user?.role || "student"}</div>
          </div>
          <img className="user-card__avatar" src={avatar} alt={user?.name || "User"} />
        </Link>
      </div>
    </header>
  );
}