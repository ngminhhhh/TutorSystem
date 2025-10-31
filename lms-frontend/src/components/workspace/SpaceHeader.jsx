import React from "react";

export default function SpaceHeader({ space }) {
  return (
    <div className="post-card mb-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="fw-bold fs-5">{space.name}</div>
        <div className="d-flex" style={{gap:6}}>
          {space.members.slice(0,5).map(m=>(
            <img key={m.id} src={m.avatar} alt={m.name} title={`${m.name} • ${m.role}`}
                 style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",border:"2px solid #e2e8f0"}}/>
          ))}
        </div>
      </div>
    </div>
  );
}
