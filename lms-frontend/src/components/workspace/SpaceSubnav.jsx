import React from "react";

export default function SpaceSubnav({ tab, setTab }) {
  const cls = (t) => `nav-link ${tab === t ? "active" : ""}`;
  return (
    <nav className="ws-subnav mb-2">
      <ul className="nav">
        <li className="nav-item">
          <button className={cls("feed")} onClick={() => setTab("feed")}>
            <i className="bi bi-megaphone me-1" /> Feed
          </button>
        </li>
        <li className="nav-item">
          <button className={cls("meetings")} onClick={() => setTab("meetings")}>
            <i className="bi bi-calendar3 me-1" /> Meetings
          </button>
        </li>
      </ul>
    </nav>
  );
}
