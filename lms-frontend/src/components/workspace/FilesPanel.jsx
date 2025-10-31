import React, { useState } from "react";

export default function FilesPanel({ files, spaceMembers, canManage, onUpload, onRemove }) {
  const [name, setName] = useState("");

  const who = (uid) => spaceMembers.find(m=>m.id===uid)?.name || "unknown";

  return (
    <div className="filter-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold"><i className="bi bi-folder2-open me-2"/>Files</div>
        {canManage && (
          <div className="d-flex" style={{gap:6}}>
            <input className="form-control form-control-sm" style={{width:180}} placeholder="(Mock) file name"
                   value={name} onChange={e=>setName(e.target.value)}/>
            <button className="btn btn-sm btn-bk" onClick={()=>{ if(name.trim()) onUpload(name.trim()); setName(""); }}>
              Upload
            </button>
          </div>
        )}
      </div>
      {files.length===0 ? (
        <div className="text-muted small">Chưa có tài liệu.</div>
      ) : (
        <div className="d-flex flex-column" style={{gap:8}}>
          {files.map(f=>(
            <div key={f.id} className="d-flex align-items-center justify-content-between p-2 rounded"
                 style={{background:"#f8fafc"}}>
              <div className="text-truncate">
                <i className="bi bi-file-earmark-text me-2"/>{f.name}
                <span className="text-muted small ms-2">{f.size}</span>
                <span className="text-muted small ms-2">• {who(f.uploadedBy)}</span>
              </div>
              {canManage && (
                <button className="btn btn-sm btn-outline-danger" onClick={()=>onRemove(f.id)}>
                  <i className="bi bi-x-lg"/>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
