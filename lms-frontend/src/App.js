import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/layout/AppLayout";
import CommunityPage from "./pages/CommunityPage";
import MatchingPage from "./pages/MatchingPage";
import WorkspacePage from "./pages/WorkspacePage";
import ProfilePage from "./pages/ProfilePage"; // ⬅️ mới

export default function App() {
  const [user, setUser] = useState(null);

  // cập nhật thông tin user từ ProfilePage
  const handleUpdateUser = (patch) =>
    setUser((prev) => ({ ...prev, ...patch }));

  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/app" element={<AppLayout user={user} />}>
            <Route index element={<Navigate to="community" replace />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="matching" element={<MatchingPage user={user} />} />
            <Route path="workspace" element={<WorkspacePage user={user} />} />
            {/* chuyển Meetings cũ sang Workspace */}
            <Route path="meetings" element={<Navigate to="../workspace" replace />} />
            {/* ⬇️ Profile Management */}
            <Route
              path="profile"
              element={<ProfilePage user={user} onUpdate={handleUpdateUser} />}
            />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
