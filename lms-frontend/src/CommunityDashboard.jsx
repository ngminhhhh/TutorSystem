import React, { useState } from 'react';
import TopBar from './components/layout/TopBar';
import NavTabs from './components/layout/NavTabs';
import CommunityPage from './pages/CommunityPage';
import MatchingPage from './pages/MatchingPage';
import MeetingsPage from './pages/MeetingsPage';

export default function CommunityDashboard({ user }){
  const [active, setActive] = useState('community');
  return (
    <div className="app-shell">
      <TopBar user={user}/>
      <NavTabs active={active} onChange={setActive}/>
      <main className="dashboard-stage">
        <div className="inner">
          {active === 'community' && <CommunityPage/>}
          {active === 'matching' && <MatchingPage/>}
          {active === 'meetings' && <MeetingsPage/>}
        </div>
      </main>
      <footer className="bk-footer">
        <div className="inner">© {new Date().getFullYear()} Trường Đại học Bách Khoa – Đại học Quốc gia TP.HCM</div>
      </footer>
    </div>
  );
}
