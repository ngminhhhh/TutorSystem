// src/components/matching/TutorRequests.jsx
import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";

export default function TutorRequests({ user }) {
  const username = user?.username;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, text: "" });

  useEffect(() => {
    if (!username) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://localhost:4000/api/matching/requests?role=tutor&username=${encodeURIComponent(
            username
          )}&status=pending`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRequests(data);
      } catch (e) {
        console.error("Load tutor requests fail:", e);
        setError("Không tải được danh sách yêu cầu. Thử F5 lại sau.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  const accept = async (req) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/matching/requests/${req.id}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // { request, workspace }
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setToast({
        open: true,
        text: `Đã chấp nhận ${
          data.request.student?.name || req.studentUsername
        }. Student đã được thêm vào workspace của bạn.`
      });
    } catch (e) {
      console.error("Accept request fail:", e);
      setToast({
        open: true,
        text: "Lỗi khi chấp nhận yêu cầu. Thử lại sau."
      });
    }
  };

  const reject = async (req) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/matching/requests/${req.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (e) {
      console.error("Reject request fail:", e);
      setToast({
        open: true,
        text: "Lỗi khi từ chối yêu cầu."
      });
    }
  };

  return (
    <div className="row g-3">
      <div className="col-lg-8">
        <div className="post-card">
          <h5>Yêu cầu ghép cặp từ sinh viên</h5>
          <hr />
          {loading && <div className="text-muted small">Đang tải…</div>}
          {error && <div className="alert alert-warning small">{error}</div>}
          {!loading && requests.length === 0 && (
            <div className="text-muted small">
              Hiện chưa có yêu cầu nào.
            </div>
          )}
          {!loading && requests.length > 0 && (
            <div className="d-flex flex-column" style={{ gap: 12 }}>
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="d-flex justify-content-between align-items-center p-2 rounded"
                  style={{ background: "#f8fafc" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <img
                      className="post-avatar"
                      src={
                        req.student?.avatar ||
                        `https://i.pravatar.cc/80?u=${encodeURIComponent(
                          req.studentUsername
                        )}`
                      }
                      alt={req.student?.name || req.studentUsername}
                    />
                    <div>
                      <div className="fw-semibold">
                        {req.student?.name || req.studentUsername}
                      </div>
                      <div className="text-muted small">
                        @{req.student?.username || req.studentUsername} •{" "}
                        {new Date(req.createdAt).toLocaleString("vi-VN")}
                      </div>
                      <div className="text-muted small">
                        Muốn kết nối với bạn để được hỗ trợ học tập.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex" style={{ gap: 8 }}>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => reject(req)}
                    >
                      Từ chối
                    </button>
                    <button
                      className="btn btn-sm btn-bk"
                      onClick={() => accept(req)}
                    >
                      Chấp nhận
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="filter-card">
          <div className="fw-bold mb-2">Ghi chú</div>
          <p className="small mb-1">
            • Khi bạn <b>Chấp nhận</b>, sinh viên sẽ được thêm vào workspace mặc
            định của bạn.
          </p>
          <p className="small mb-0">
            • Bạn có thể mở tab <b>Workspace</b> để xem danh sách thành viên sau
            khi ghép cặp.
          </p>
        </div>
      </div>

      <Modal
        open={toast.open}
        title="Thông báo"
        onClose={() => setToast({ open: false, text: "" })}
        actions={null}
      >
        {toast.text}
      </Modal>
    </div>
  );
}
