import React from "react";

export default function PostCard({ post, author, canPin, onPin, onDelete }) {
  return (
    <div className="post-card mb-3">
      <div className="post-header">
        <img className="post-avatar" src={author?.avatar} alt={author?.name}/>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <div>
              <div className="post-author">{author?.name}</div>
              <div className="text-muted small">{author?.role}</div>
            </div>
            <div className="d-flex align-items-center" style={{gap:8}}>
              {post.pinned && <span className="badge bg-warning text-dark"><i className="bi bi-pin-angle me-1"/>pinned</span>}
              {canPin && (
                <button className="btn btn-sm btn-outline-secondary" onClick={onPin}>
                  <i className="bi bi-pin-angle"/> {post.pinned ? "Unpin" : "Pin"}
                </button>
              )}
              {(canPin || true) && (author) && (
                <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
                  <i className="bi bi-trash"/>
                </button>
              )}
            </div>
          </div>
          <div className="post-content mt-2" style={{whiteSpace:"pre-wrap"}}>{post.content}</div>
          {post.attachments?.length>0 && (
            <div className="mt-2">
              {post.attachments.map((a,i)=>(
                <div key={i} className="small">
                  <i className="bi bi-paperclip me-2"/>{a}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
