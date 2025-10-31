import React, { useMemo, useState } from "react";
import Modal from "../common/Modal"; // đường dẫn đã dùng ở MatchingPage

const pad = (n) => String(n).padStart(2, "0");
const fmt = (dateISO, durMin) => {
  const d = new Date(dateISO);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} • ${pad(d.getHours())}:${pad(d.getMinutes())} • ${durMin}’`;
};

export default function UpcomingMeetings({ initial = [] }) {
  // seed ví dụ nếu chưa truyền từ ngoài
  const [meetings, setMeetings] = useState(
    initial.length
      ? initial
      : [
          {
            id: "m1",
            title: "Weekly Checkpoint",
            startAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), // +2 ngày
            duration: 60,
            joinUrl: "#",
          },
        ]
  );

  // modal state
  const now = new Date();
  const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const defaultTime = `${pad(now.getHours())}:${pad(
    Math.ceil(now.getMinutes() / 5) * 5
  )}`;

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [dur, setDur] = useState(60);
  const [err, setErr] = useState("");

  const upcoming = useMemo(
    () =>
      [...meetings]
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
        .slice(0, 5),
    [meetings]
  );

  const createMeeting = () => {
    if (!title.trim()) return setErr("Vui lòng nhập tên buổi họp.");
    if (!date || !time) return setErr("Ngày/giờ không hợp lệ.");
    const start = new Date(`${date}T${time}:00`);
    if (Number.isNaN(start.getTime())) return setErr("Ngày/giờ không hợp lệ.");
    if (dur <= 0) return setErr("Thời lượng phải > 0.");

    const m = {
      id: `m_${Date.now()}`,
      title: title.trim(),
      startAt: start.toISOString(),
      duration: parseInt(dur, 10),
      joinUrl: "#", // mock
    };
    setMeetings((old) => [m, ...old]);
    // reset & đóng modal
    setTitle("");
    setDate(defaultDate);
    setTime(defaultTime);
    setDur(60);
    setErr("");
    setOpen(false);
  };

  return (
    <>
      <div className="post-card mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-bold">
            <i className="bi bi-calendar2-week me-2" />
            Upcoming meetings
          </div>
          <button className="btn btn-sm btn-bk btn-round" onClick={() => setOpen(true)}>
            <i className="bi bi-plus-lg me-1" />
            Tạo cuộc họp
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-muted small mt-2">Chưa có lịch họp.</div>
        ) : (
          <div className="mt-2">
            {upcoming.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-3 mb-2"
                style={{ background: "#f1f5f9" }}
              >
                <div className="fw-bold">{m.title}</div>
                <div className="text-muted small mt-1">
                  {fmt(m.startAt, m.duration)}
                </div>
                <div className="mt-2">
                  <a href={m.joinUrl} className="link-primary text-decoration-none">
                    <i className="bi bi-link-45deg me-1" />
                    Join
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo mới */}
      <Modal
        open={open}
        title="Tạo cuộc họp"
        onClose={() => {
          setOpen(false);
          setErr("");
        }}
        actions={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setOpen(false)}>
              Hủy
            </button>
            <button className="btn btn-bk" onClick={createMeeting}>
              Tạo cuộc họp
            </button>
          </>
        }
      >
        <div className="mb-2">
          <label className="form-label fw-semibold">Tên buổi họp</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Weekly Checkpoint"
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="form-label fw-semibold">Ngày</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label fw-semibold">Thời gian</label>
            <input
              type="time"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label fw-semibold">Thời lượng (phút)</label>
            <input
              type="number"
              min={5}
              step={5}
              className="form-control"
              value={dur}
              onChange={(e) => setDur(e.target.value)}
            />
          </div>
        </div>

        {err && <div className="text-danger small mt-1">{err}</div>}
      </Modal>
    </>
  );
}
