import React from 'react';

export default function MeetingsPage(){
  const items = [
    {t:"ML Mentoring", when:"Tomorrow 14:00–15:00", where:"Zoom", host:"Tutor Dat"},
    {t:"Algo Office Hour", when:"Wed 9:00–10:00", where:"Room B4-12", host:"TA Thao"}
  ];
  return (
    <div className="filter-card">
      <div className="fw-bold mb-2"><i className="bi bi-calendar2-week me-2"/>Meeting Management</div>
      <ul className="list-group list-group-flush">
        {items.map((m, i)=>(
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">{m.t}</div>
              <div className="text-muted small">{m.when} · {m.where} · Host: {m.host}</div>
            </div>
            <div className="d-flex" style={{gap:8}}>
              <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-pencil-square"/></button>
              <button className="btn btn-bk btn-sm"><i className="bi bi-play-circle me-1"/>Join</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
