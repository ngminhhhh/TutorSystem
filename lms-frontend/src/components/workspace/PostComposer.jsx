import React, { useState } from "react";

export default function PostComposer({ onPost }) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  return (
    <div className="composer mb-3">
      <textarea className="form-control" placeholder="Chia sẻ cập nhật cho workspace…"
                value={text} onChange={e=>setText(e.target.value)} />
      <div className="d-flex justify-content-between mt-2">
        <div className="d-flex align-items-center" style={{gap:8}}>
          <input className="form-control form-control-sm" style={{width:260}}
                 placeholder="(Mock) nhập tên đính kèm, vd slides.pdf"
                 value={fileName} onChange={e=>setFileName(e.target.value)}/>
        </div>
        <button className="btn btn-bk btn-round"
                onClick={()=>{ onPost(text, fileName? [fileName] : []); setText(""); setFileName(""); }}>
          Đăng
        </button>
      </div>
    </div>
  );
}
