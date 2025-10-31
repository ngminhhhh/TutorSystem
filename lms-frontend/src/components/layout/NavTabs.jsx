import React from "react";
import { NavLink } from "react-router-dom";

export default function NavTabs() {
  const cls = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  return (
    <nav className="nav-secondary sticky-top">
      <div className="inner">
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/app/community" className={cls}>
              <i className="bi bi-people me-1" /> Community
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/app/matching" className={cls}>
              <i className="bi bi-person-hearts me-1" /> Tutor-Student Matching
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/app/workspace" className={cls}>
              <i className="bi bi-kanban me-1" /> Workspace
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
