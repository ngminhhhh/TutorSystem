import React from 'react';

export default function PostCard({ p }) {
  return (
    <div className="post-card mb-3">
      <div className="post-header">
        <img className="post-avatar" src={p.author.avatar} alt={p.author.name}/>
        <div>
          <div className="post-author">{p.author.name} <span className="text-muted fw-normal">· {p.author.title}</span></div>
          <div className="post-meta">
            {p.time} · <span className="badge badge-tag">{p.course}</span> · {p.type}
          </div>
        </div>
      </div>
      <div className="post-content">{p.content}</div>
      <div className="post-actions d-flex gap-2 mt-2">
        <button className="btn btn-sm"><i className="bi bi-hand-thumbs-up me-1"/>{p.likes}</button>
        <button className="btn btn-sm"><i className="bi bi-chat me-1"/>{p.comments}</button>
        <button className="btn btn-sm"><i className="bi bi-share me-1"/>Share</button>
      </div>
    </div>
  );
}
