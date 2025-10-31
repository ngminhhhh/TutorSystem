import React, { useEffect, useRef, useState } from "react";

export default function StudentSearch({
  query, setQuery, onSubmit, recent, trending, onPick
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (text) => { setQuery(text); setOpen(false); onPick?.(text); };

  return (
    <div className="position-relative" ref={boxRef}>
      <div className="composer mb-2">
        <div className="d-flex align-items-center" style={{gap:12}}>
          <i className="bi bi-search fs-5 text-muted" />
          <input
            className="form-control"
            placeholder="Tìm tutor theo tên hoặc mã số trợ giảng…"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onFocus={()=>setOpen(true)}
            onKeyDown={(e)=>{ if(e.key==='Enter'){ onSubmit?.(); setOpen(false); } }}
          />
          <button className="btn btn-bk" onClick={()=>{ onSubmit?.(); setOpen(false); }}>
            Tìm
          </button>
        </div>
      </div>

      {open && (
        <div className="suggest-panel">
          <div className="suggest-section">
            <div className="title"><i className="bi bi-clock-history me-1"/>Lịch sử tìm kiếm</div>
            {(recent?.length ? recent : ["Le Dat","Thao Tran","TA 1234"]).map((t,i)=>(
              <div key={i} className="suggest-item" onMouseDown={()=>pick(t)}>
                <i className="bi bi-clock-history text-muted" />
                <div>{t}</div>
              </div>
            ))}
          </div>
          <hr className="my-2"/>
          <div className="suggest-section">
            <div className="title"><i className="bi bi-fire me-1"/>Được tìm kiếm nhiều</div>
            {(trending?.length ? trending : ["Nguyen Minh • AI","Dat Le • ML","Thao Tran • Algorithms"]).map((t,i)=>(
              <div key={i} className="suggest-item" onMouseDown={()=>pick(t)}>
                <i className="bi bi-star text-warning" />
                <div>{t}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
