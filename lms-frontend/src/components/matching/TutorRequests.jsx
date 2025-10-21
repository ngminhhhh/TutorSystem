import React, { useMemo, useState } from "react";
import Modal from "../common/Modal";

export default function TutorRequests() {
  const [query, setQuery] = useState({ when:"", major:"", course:"" });
  const [reject, setReject] = useState({ open:false, item:null, reason:"" });
  const [ok, setOk] = useState({ open:false, text:"" });

  const items = [
    { id:1, student:{name:"Lan Pham", avatar:"https://i.pravatar.cc/80?img=48", major:"CS"}, course:"Machine Learning", sent:"2025-10-21 09:12", status:"Đang chờ" },
    { id:2, student:{name:"Khoa Vu",  avatar:"https://i.pravatar.cc/80?img=12", major:"SE"}, course:"Algorithms",       sent:"2025-10-20 19:05", status:"Đang chờ" },
  ];

  const filtered = useMemo(()=>{
    return items.filter(m =>
      (!query.when || m.sent.startsWith(query.when)) &&
      (!query.major || m.student.major===query.major) &&
      (!query.course || m.course===query.course)
    );
  }, [items, query]);

  const accept = (it) => setOk({ open:true, text:`Bạn đã chấp nhận sinh viên ${it.student.name}. Hệ thống sẽ thông báo cho sinh viên.` });

  const rejectSubmit = () => {
    if (!reject.reason.trim()) return;
    setReject({ open:false, item:null, reason:"" });
    setOk({ open:true, text:`Bạn đã từ chối sinh viên ${reject.item.student.name} – Lý do: ${reject.reason}` });
  };

  return (
    <div className="filter-card">
      <div className="fw-bold mb-2"><i className="bi bi-inboxes me-2"/>Yêu cầu ghép cặp</div>
      {/* Toolbar filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <label className="form-label mb-1">Ngày gửi</label>
          <input type="date" className="form-control" value={query.when} onChange={e=>setQuery(q=>({...q, when:e.target.value}))}/>
        </div>
        <div className="col-md-4">
          <label className="form-label mb-1">Chuyên ngành</label>
          <select className="form-select" value={query.major} onChange={e=>setQuery(q=>({...q, major:e.target.value}))}>
            <option value="">Tất cả</option><option>CS</option><option>SE</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label mb-1">Môn cần hỗ trợ</label>
          <select className="form-select" value={query.course} onChange={e=>setQuery(q=>({...q, course:e.target.value}))}>
            <option value="">Tất cả</option><option>Machine Learning</option><option>Algorithms</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="row g-2">
        {filtered.map(it=>(
          <div className="col-md-6" key={it.id}>
            <div className="post-card">
              <div className="d-flex align-items-center" style={{gap:12}}>
                <img className="post-avatar" src={it.student.avatar} alt={it.student.name}/>
                <div className="flex-grow-1">
                  <div className="post-author">{it.student.name}</div>
                  <div className="text-muted small">{it.student.major} • {it.course}</div>
                  <div className="text-muted small">Gửi: {it.sent}</div>
                  <span className="badge tutor-tag mt-1">{it.status}</span>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2" style={{gap:8}}>
                <button className="btn btn-outline-secondary" onClick={()=>setOk({open:true, text:`(Mock) Xem hồ sơ chi tiết của ${it.student.name}`})}>
                  Xem chi tiết
                </button>
                <button className="btn btn-bk" onClick={()=>accept(it)}>Chấp nhận</button>
                <button className="btn btn-outline-danger" onClick={()=>setReject({open:true, item:it, reason:""})}>Từ chối</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <Modal open={ok.open} title="Thông báo" onClose={()=>setOk({open:false, text:""})}
        actions={null}
      >
        {ok.text}
      </Modal>

      <Modal open={reject.open} title={`Từ chối – ${reject.item?.student.name || ""}`} onClose={()=>setReject({open:false,item:null,reason:""})}
        actions={<button className="btn btn-danger" onClick={rejectSubmit}>Xác nhận từ chối</button>}
      >
        <label className="form-label">Lý do cụ thể</label>
        <textarea className="form-control" rows={3}
          placeholder="Vui lòng nêu rõ lý do từ chối…" value={reject.reason}
          onChange={(e)=>setReject(r=>({...r, reason:e.target.value}))}
        />
      </Modal>
    </div>
  );
}
