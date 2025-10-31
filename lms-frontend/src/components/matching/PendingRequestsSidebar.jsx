import React from "react";

export default function PendingRequestsSidebar({ requests, onCancel }) {
  return (
    <div className="filter-card pending-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold">
          <i className="bi bi-hourglass-split me-2" />
          Yêu cầu đã gửi
        </div>
        <span className="badge bg-primary rounded-pill">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <div className="text-muted small">
          Chưa có yêu cầu nào đang chờ phản hồi.
        </div>
      ) : (
        <div className="req-list">
          {requests.map((r) => (
            <div key={r.id} className="req-item">
              <img className="req-avatar" src={r.tutor.avatar} alt={r.tutor.name} />
              <div className="req-meta">
                <div className="fw-bold">{r.tutor.name}</div>
                <div className="text-muted small">{r.tutor.specialty}</div>
              </div>
              <div className="req-right">
                <div className="req-time text-muted small">{r.sentAt}</div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onCancel(r.id)}
                  title="Hủy yêu cầu ghép cặp"
                >
                  <i className="bi bi-x-circle me-1" />
                  Hủy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
