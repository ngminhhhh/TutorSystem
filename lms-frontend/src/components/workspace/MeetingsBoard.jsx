import React, { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";

// Utilities
function toDate(m) {
  try {
    const [h, min] = String(m.time || "00:00").split(":").map(Number);
    const d = new Date(`${m.date}T00:00:00`);
    d.setHours(h || 0, min || 0, 0, 0);
    return d;
  } catch {
    return new Date(0);
  }
}
function getStatus(m, now = new Date()) {
  return toDate(m).getTime() < now.getTime() ? "past" : "upcoming";
}

export default function MeetingsBoard({
  meetings = [],
  canManage = false,
  onCreate,
  onCancel,
  onFeedback,
  onSummarize,
}) {
  // Create modal state
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: 60,
    location: "Online",
    link: "",
  });

  // Selection & filter
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("upcoming"); // 'all' | 'upcoming' | 'past'

  // Enhance + sort meetings
  const enhanced = useMemo(() => {
    const now = new Date();
    return (meetings || [])
      .map((m) => ({ ...m, __status: getStatus(m, now) }))
      .sort((a, b) => toDate(a) - toDate(b));
  }, [meetings]);

  const counts = useMemo(
    () => ({
      all: enhanced.length,
      upcoming: enhanced.filter((m) => m.__status === "upcoming").length,
      past: enhanced.filter((m) => m.__status === "past").length,
    }),
    [enhanced]
  );

  const list = useMemo(() => {
    if (view === "all") return enhanced;
    return enhanced.filter((m) => m.__status === view);
  }, [enhanced, view]);

  // Keep a valid selection whenever list/view changes
  useEffect(() => {
    if (!list.some((m) => m.id === selected)) {
      setSelected(list[0]?.id ?? null);
    }
  }, [list, selected]);

  const cur = useMemo(
    () => enhanced.find((m) => m.id === selected) || null,
    [enhanced, selected]
  );

  // Create meeting
  const create = () => {
    if (!form.title || !form.date || !form.time) return;
    onCreate?.(form);
    setOpenNew(false);
    setForm({ title: "", date: "", time: "", duration: 60, location: "Online", link: "" });
    // Không thể biết id mới do parent sinh — selection sẽ tự cập nhật khi prop meetings đổi
  };

  // Cancel selected
  const cancelCurrent = () => {
    if (!cur) return;
    const id = cur.id;
    setSelected(null);
    onCancel?.(id);
  };

  // Feedback modal
  const [fbOpen, setFbOpen] = useState(false);
  const [fb, setFb] = useState({ text: "", rating: 5 });
  const submitFeedback = () => {
    if (!cur) return;
    onFeedback?.(cur.id, fb);
    setFbOpen(false);
    setFb({ text: "", rating: 5 });
  };

  return (
    <div className="post-card">
      {/* Header + Schedule */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold">
          <i className="bi bi-calendar3 me-2" />
          Meetings
        </div>
        {canManage && (
          <button className="btn btn-bk btn-round" onClick={() => setOpenNew(true)}>
            <i className="bi bi-plus-lg me-1" />
            Schedule
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <button
          className={`btn btn-sm ${view === "all" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setView("all")}
        >
          All <span className="badge bg-light text-dark ms-1">{counts.all}</span>
        </button>
        <button
          className={`btn btn-sm ${view === "upcoming" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setView("upcoming")}
        >
          Upcoming <span className="badge bg-light text-dark ms-1">{counts.upcoming}</span>
        </button>
        <button
          className={`btn btn-sm ${view === "past" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setView("past")}
        >
          Past <span className="badge bg-light text-dark ms-1">{counts.past}</span>
        </button>
      </div>

      <div className="row g-3">
        {/* LEFT: list */}
        <div className="col-lg-5">
          {list.length === 0 ? (
            <div className="text-muted small">Không có meeting.</div>
          ) : (
            <div className="list-group">
              {list.map((m) => {
                const active = cur?.id === m.id;
                return (
                  <button
                    key={m.id}
                    className={`list-group-item list-group-item-action ${active ? "active" : ""}`}
                    onClick={() => setSelected(m.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        minWidth: 0, // cho phép truncate
                      }}
                    >
                      <div
                        className="fw-semibold"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.title}
                      </div>
                      <span
                        className={`badge ${m.__status === "past" ? "text-bg-secondary" : "text-bg-success"}`}
                        style={{ flex: "0 0 auto", whiteSpace: "nowrap" }} // badge không co giãn -> không đẩy title
                      >
                        {m.__status === "past" ? "Đã diễn ra" : "Sắp diễn ra"}
                      </span>
                    </div>
                    <div className={`small ${active ? "text-white-50" : "text-muted"}`}>
                      {m.date} • {m.time} • {m.duration}’
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: detail */}
        <div className="col-lg-7">
          {!cur ? (
            <div className="text-muted">Chọn một meeting để xem chi tiết.</div>
          ) : (
            <div className="border rounded p-3" style={{ background: "#f8fafc" }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="h6 mb-1">{cur.title}</div>
                  <div className="text-muted small mb-1">
                    {cur.date} • {cur.time} • {cur.duration}’ • {cur.location}
                  </div>
                  {!!cur.link && (
                    <a href={cur.link} target="_blank" rel="noreferrer" className="small">
                      <i className="bi bi-link-45deg me-1" />
                      Join
                    </a>
                  )}
                </div>

                <div className="d-flex" style={{ gap: 8 }}>
                  {cur.__status === "upcoming" && canManage && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={cancelCurrent}
                      title="Delete meeting"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  )}

                  {cur.__status === "past" && (
                    <>
                      {canManage && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => onSummarize?.(cur.id)}
                          title="Summarize notes"
                        >
                          <i className="bi bi-magic" /> Summarize
                        </button>
                      )}
                      <button
                        className="btn btn-bk btn-sm"
                        onClick={() => setFbOpen(true)}
                        title="Leave feedback"
                      >
                        <i className="bi bi-chat-dots me-1" /> Feedback
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Summary for past */}
              {cur.__status === "past" && cur.summary && (
                <div className="alert alert-primary mt-3 mb-2 py-2">
                  <b>Tóm tắt:</b> {cur.summary}
                </div>
              )}

              {/* Feedback list for past */}
              {cur.__status === "past" && (
                <div className="mt-2">
                  <div className="fw-semibold mb-1">Feedback</div>
                  {(!cur.feedback || cur.feedback.length === 0) && (
                    <div className="text-muted small">Chưa có feedback.</div>
                  )}
                  {(cur.feedback || []).map((f, i) => (
                    <div key={i} className="p-2 rounded mb-2" style={{ background: "#fff" }}>
                      <div className="small">
                        <span className="fw-semibold">{f.author || "Student"}</span>
                        <span className="ms-2">
                          {Array.from({ length: f.rating || 5 }).map((_, k) => (
                            <i key={k} className="bi bi-star-fill text-warning" />
                          ))}
                        </span>
                      </div>
                      <div>{f.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Note for upcoming */}
              {cur.__status === "upcoming" && (
                <div className="text-muted small mt-2">
                  Cuộc họp chưa diễn ra. Bạn có thể hủy hoặc chỉnh sửa (mock) nếu cần.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Schedule modal */}
      <Modal
        open={openNew}
        title="Schedule meeting"
        onClose={() => setOpenNew(false)}
        actions={
          <button className="btn btn-bk" onClick={create}>
            Create
          </button>
        }
      >
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="row">
          <div className="col-6 mb-2">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
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
              onChange={(e) => setForm({ ...form, duration: +e.target.value })}
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label">Join link (optional)</label>
          <input
            className="form-control"
            placeholder="https://…"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </div>
      </Modal>

      {/* Feedback modal */}
      <Modal
        open={fbOpen}
        title="Leave feedback"
        onClose={() => setFbOpen(false)}
        actions={
          <button className="btn btn-bk" onClick={submitFeedback}>
            Submit
          </button>
        }
      >
        <div className="mb-2">
          <label className="form-label">Rating</label>
          <input
            type="number"
            min={1}
            max={5}
            className="form-control"
            value={fb.rating}
            onChange={(e) => setFb({ ...fb, rating: +e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Comment</label>
          <textarea
            rows={3}
            className="form-control"
            value={fb.text}
            onChange={(e) => setFb({ ...fb, text: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
