import React from "react";

export default function SpaceSidebar({ spaces, activeId, onSelect }) {
  return (
    <div className="filter-card">
      <div className="fw-bold mb-2"><i className="bi bi-kanban me-2"/>Workspaces</div>
      <div className="d-flex flex-column" style={{gap:8}}>
        {spaces.map(s=>(
          <button key={s.id}
                  className={`btn w-100 text-start ${s.id===activeId ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={()=>onSelect(s.id)}>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
