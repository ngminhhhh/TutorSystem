// src/components/layout/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import NavTabs from "./NavTabs";

export default function AppLayout({ user, onLogout }) {
  return (
    <div className="app-shell">
      <TopBar user={user} onLogout={onLogout} />

      <NavTabs />

      <main className="dashboard-stage">
        <div className="inner">
          <Outlet />
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
