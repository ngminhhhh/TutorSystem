// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/layout/AppLayout";
import CommunityPage from "./pages/CommunityPage";
import MatchingPage from "./pages/MatchingPage";
import WorkspacePage from "./pages/WorkspacePage";
import ProfilePage from "./pages/ProfilePage";

const STORAGE_KEY = "lms-current-user";

export default function App() {
  const [user, setUser] = useState(null);

  // Khi load app, thử lấy user từ localStorage (để F5 không mất login)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      // hỏng format thì bỏ
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Khi login thành công từ LoginPage
  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  // Khi profile cập nhật (từ ProfilePage)
  const handleUpdateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      // ProfilePage có thể truyền full user hoặc chỉ patch, merge cho chắc ăn
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/app" element={<AppLayout user={user} />}>
            <Route index element={<Navigate to="community" replace />} />

            <Route path="community" element={<CommunityPage user={user} />} />

            <Route path="matching" element={<MatchingPage user={user} />} />

            <Route path="workspace" element={<WorkspacePage user={user} />} />

            {/* Meetings cũ chuyển hướng sang Workspace */}
            <Route path="meetings" element={<Navigate to="../workspace" replace />} />

            {/* Profile Management */}
            <Route
              path="profile"
              element={<ProfilePage user={user} onUpdate={handleUpdateUser} />}
            />
          </Route>

          {/* fallback khi đã login */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      ) : (
        <Routes>
          {/* Màn login, nhận user từ backend rồi đẩy lên App */}
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
