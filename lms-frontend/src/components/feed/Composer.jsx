import React, { useState } from 'react';

export default function Composer({ onPost }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('Question');
  const [course, setCourse] = useState('AI Fundamentals');

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onPost({
      id: Math.random().toString(36).slice(2),
      author: { name: "You", title: "Student", avatar: "https://i.pravatar.cc/80?img=68" },
      time: "now", type, course, content: v, likes: 0, comments: 0
    });
    setText('');
  };

  return (
    <div className="composer mb-3">
      <div className="d-flex" style={{gap:12}}>
        <img className="post-avatar" src="https://i.pravatar.cc/80?img=68" alt="you"/>
        <div className="flex-grow-1">
          <textarea className="form-control" placeholder="Share an update or ask a question…" value={text} onChange={(e)=>setText(e.target.value)} />
          <div className="d-flex justify-content-between align-items-center mt-2" style={{gap:8}}>
            <div className="d-flex" style={{gap:8}}>
              <select className="form-select form-select-sm" style={{borderRadius:10, width:165}} value={type} onChange={(e)=>setType(e.target.value)}>
                <option>Question</option><option>Announcement</option><option>Share</option>
              </select>
              <select className="form-select form-select-sm" style={{borderRadius:10, width:190}} value={course} onChange={(e)=>setCourse(e.target.value)}>
                <option>AI Fundamentals</option><option>Algorithms</option><option>Machine Learning</option>
              </select>
            </div>
            <button className="btn btn-bk" onClick={submit}><i className="bi bi-send me-1"/>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
