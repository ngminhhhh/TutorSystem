import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import NavTabs from "./NavTabs";

export default function AppLayout({ user }) {
  return (
    <div className="app-shell">
      <TopBar user={user} />        {/* luôn hiển thị */}
      <NavTabs />                   {/* luôn hiển thị */}
      <main className="dashboard-stage">
        <div className="inner">
          <Outlet />                {/* chỗ render từng page */}
        </div>
      </main>
      <footer className="bk-footer">
        <div className="inner">
          © {new Date().getFullYear()} Trường Đại học Bách Khoa – Đại học Quốc gia TP.HCM
        </div>
      </footer>
    </div>
  );
}
