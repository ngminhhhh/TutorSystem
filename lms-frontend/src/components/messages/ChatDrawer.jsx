import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatDrawer({ open, conversation, me, onClose, onSend }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  if (!open || !conversation) return null;

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <>
      {/* <div className="chat-backdrop" onClick={onClose} /> */}
      <aside className="chat-drawer">
        <div className="chat-header">
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <img className="chat-avatar" src={conversation.other.avatar} alt={conversation.other.name} />
            <div>
              <div className="fw-bold">{conversation.other.name}</div>
              <div className="text-muted small">{conversation.online ? "Online" : "Offline"}</div>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-secondary btn-round" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="chat-body">
          {conversation.messages.map((m) => (
            <MessageBubble key={m.id} mine={m.from === me.id} text={m.text} time={m.time} />
          ))}
        </div>

        <div className="chat-input">
          <input
            ref={inputRef}
            className="form-control"
            placeholder="Write a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="btn btn-bk btn-round ms-2" onClick={submit}>
            <i className="bi bi-send-fill" />
          </button>
        </div>
      </aside>
    </>
  );
}
