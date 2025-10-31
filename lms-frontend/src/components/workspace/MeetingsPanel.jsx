import React, { useState } from "react";
import Modal from "../common/Modal";

export default function MeetingsPanel({ meetings, canManage, onCreate, onCancel }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", date: "", time: "", duration: 60, location: "Online", link: ""
  });

  const invalid = !form.title || !form.date || !form.time;

  const create = () => {
    if (invalid) return;
    onCreate(form);
    setOpen(false);
    setForm({ title:"", date:"", time:"", duration:60, location:"Online", link:"" });
  };

  return (
    <div className="filter-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold">
          <i className="bi bi-calendar3 me-2" />
          Upcoming meetings
        </div>
        {canManage && (
          <button className="btn btn-sm btn-bk btn-round" onClick={() => setOpen(true)}>
            <i className="bi bi-plus-lg me-1" /> Schedule
          </button>
        )}
      </div>

      {meetings.length === 0 ? (
        <div className="text-muted small">Chưa có lịch họp.</div>
      ) : (
        <div className="d-flex flex-column" style={{ gap: 8 }}>
          {meetings.map(m => (
            <div
              key={m.id}
              className="d-flex justify-content-between align-items-start p-2 rounded"
              style={{ background: "#f8fafc" }}
            >
              <div>
                <div className="fw-bold">{m.title}</div>
                <div className="text-muted small">
                  {m.date} • {m.time} • {m.duration}’
                </div>
                {m.link && (
                  <a className="small" href={m.link} target="_blank" rel="noreferrer">
                    <i className="bi bi-link-45deg me-1" />
                    Join
                  </a>
                )}
              </div>

              {canManage && (
                <button
                  className="btn btn-icon btn-ghost-danger"
                  onClick={() => onCancel(m.id)}
                  title="Hủy cuộc họp"
                  aria-label="Cancel meeting"
                >
                  <i className="bi bi-trash" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        title="Schedule meeting"
        onClose={() => setOpen(false)}
        actions={
          <button className="btn btn-bk" disabled={invalid} onClick={create}>
            Create
          </button>
        }
      >
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="form-label">Duration (min)</label>
            <input
              type="number"
              className="form-control"
              value={form.duration}
              onChange={e => setForm({ ...form, duration: +e.target.value })}
              min={1}
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              placeholder="Online / Room…"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="form-label">Join link (optional)</label>
          <input
            className="form-control"
            placeholder="https://…"
            value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
