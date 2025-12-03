// src/components/matching/PendingRequestsSidebar.jsx
import React from "react";

export default function PendingRequestsSidebar({ requests, onCancel }) {
  return (
    <div className="filter-card">
      <div className="fw-bold mb-2">
        <i className="bi bi-hourglass-split me-1" /> Yêu cầu đã gửi
      </div>
      {requests.length === 0 ? (
        <div className="text-muted small">Bạn chưa gửi yêu cầu nào.</div>
      ) : (
        <div className="d-flex flex-column" style={{ gap: 8 }}>
          {requests.map((r) => (
            <div
              key={r.id}
              className="d-flex align-items-center justify-content-between p-2 rounded"
              style={{ background: "#f8fafc" }}
            >
              <div className="d-flex align-items-center" style={{ gap: 8 }}>
                <img
                  src={r.tutor.avatar}
                  alt={r.tutor.name}
                  className="post-avatar"
                />
                <div>
                  <div className="small fw-semibold">{r.tutor.name}</div>
                  <div className="text-muted small">
                    {r.tutor.specialty}
                    {r.sentAt ? ` • ${r.sentAt}` : ""}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onCancel?.(r.id)}
              >
                Huỷ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
