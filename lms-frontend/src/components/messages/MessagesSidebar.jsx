import React, { useMemo, useState } from "react";

export default function MessagesSidebar({ convos, onOpen }) {
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      convos.filter((c) =>
        c.other.name.toLowerCase().includes(q.toLowerCase())
      ),
    [convos, q]
  );

  return (
    <div className="filter-card messages-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold"><i className="bi bi-chat-dots me-2" />Messages</div>
        <button className="btn btn-sm btn-outline-secondary btn-round" title="New chat">
          <i className="bi bi-pencil-square" />
        </button>
       </div>

    <div className="mb-2">
        <div className="input-group input-group-sm msg-search">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
            className="form-control"
            placeholder="Search students…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            />
        </div>
    </div>

      <div className="chat-list">
        {list.map((c) => (
            <button
                key={c.id}
                className={`chat-item ${c.unread ? "unread" : ""}`}
                onClick={() => onOpen(c.id)}
                >
                <span className="chat-avatar-wrap">
                    <img className="chat-avatar" src={c.other.avatar} alt={c.other.name} />
                    {c.online && <span className="online-dot" />}
                </span>

                <div className="chat-meta">
                    <div className="chat-name">{c.other.name}</div>
                    <div className="chat-snippet text-muted small">
                    {c.messages[c.messages.length - 1]?.text || " "}
                    </div>
                </div>

                <div className="chat-right">
                    <div className="chat-time">{c.lastAt}</div>
                    {c.unread > 0 && (
                    <span className="badge bg-primary rounded-pill">{c.unread}</span>
                    )}
                </div>
            </button>

        ))}
        {list.length === 0 && <div className="text-muted small">No conversations</div>}
      </div>
    </div>
  );
}
