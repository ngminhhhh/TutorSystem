// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/layout/AppLayout";
import CommunityPage from "./pages/CommunityPage";
import MatchingPage from "./pages/MatchingPage";
import WorkspacePage from "./pages/WorkspacePage";
import ProfilePage from "./pages/ProfilePage";

const STORAGE_KEY = "lms_user";

export default function App() {
  const [user, setUser] = useState(null);

  // Auto login từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to read user from storage", e);
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {
      console.error("Failed to save user to storage", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear user from storage", e);
    }
  };

  // Update profile từ ProfilePage
  const handleUpdateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to update user in storage", e);
      }
      return next;
    });
  };

  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route
            path="/app"
            element={<AppLayout user={user} onLogout={handleLogout} />}
          >
            <Route index element={<Navigate to="community" replace />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="matching" element={<MatchingPage user={user} />} />
            <Route path="workspace" element={<WorkspacePage user={user} />} />
            {/* Meetings cũ điều hướng về Workspace */}
            <Route path="meetings" element={<Navigate to="../workspace" replace />} />
            <Route
              path="profile"
              element={<ProfilePage user={user} onUpdate={handleUpdateUser} />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
