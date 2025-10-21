import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/layout/AppLayout";
import CommunityPage from "./pages/CommunityPage";
import MatchingPage from "./pages/MatchingPage";
import MeetingsPage from "./pages/MeetingsPage";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/app" element={<AppLayout user={user} />}>
            <Route index element={<Navigate to="community" replace />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="matching" element={<MatchingPage user={user} />} /> 
            <Route path="meetings" element={<MeetingsPage />} />
            {/* <Route path="user-management" element={<UserManagementPage user={user} />} /> */}
          </Route>
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
