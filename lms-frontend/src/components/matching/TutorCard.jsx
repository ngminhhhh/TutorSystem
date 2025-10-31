import React, { useState } from "react";
import Modal from "../common/Modal";

export default function TutorCard({ tutor, onRequest, isPending = false }) {
  const [open, setOpen] = useState(false);

  const stars = Array.from({ length: 5 }, (_, i) => (
    <i
      key={i}
      className={`bi ${i < Math.round(tutor.rating) ? "bi-star-fill" : "bi-star"} me-1`}
    />
  ));

  const handleRequest = () => {
    if (isPending) return;           // đã gửi thì không làm gì
    onRequest?.(tutor);
  };

  return (
    <>
      <div className="post-card mb-3">
        <div className="d-flex" style={{ gap: 12 }}>
          <img className="post-avatar" src={tutor.avatar} alt={tutor.name} />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="post-author">{tutor.name}</div>
                <div className="text-muted small">{tutor.title}</div>
              </div>
              <div className="rating text-nowrap">
                {stars}
                <span className="ms-1 small text-muted">{tutor.rating?.toFixed?.(1)}</span>
              </div>
            </div>

            <div className="mt-2 d-flex flex-wrap" style={{ gap: 8 }}>
              {tutor.tags?.map((t, i) => (
                <span key={i} className="tutor-tag">{t}</span>
              ))}
            </div>

            <div className="post-content mt-2">{tutor.bio}</div>

            <div className="d-flex justify-content-end mt-2" style={{ gap: 8 }}>
              <button
                className="btn btn-outline-secondary btn-round"
                onClick={() => setOpen(true)}
              >
                Xem chi tiết
              </button>
              <button
                className="btn btn-bk btn-round"
                disabled={isPending}
                aria-disabled={isPending}
                onClick={handleRequest}
              >
                {isPending ? "Đã gửi" : "Gửi yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        title={`Hồ sơ Tutor – ${tutor.name}`}
        onClose={() => setOpen(false)}
        actions={
          isPending ? (
            <button className="btn btn-secondary" disabled>
              Đã gửi
            </button>
          ) : (
            <button
              className="btn btn-bk"
              onClick={() => {
                setOpen(false);
                handleRequest();
              }}
            >
              Gửi yêu cầu
            </button>
          )
        }
      >
        <div className="d-flex" style={{ gap: 14 }}>
          <img className="post-avatar" src={tutor.avatar} alt={tutor.name} />
          <div>
            <div className="fw-bold">{tutor.name}</div>
            <div className="text-muted small">{tutor.title}</div>
            <div className="rating mt-1">{stars}</div>
          </div>
        </div>
        <hr />
        <div><b>Chuyên môn:</b> {tutor.tags?.join(", ")}</div>
        {tutor.exp && <div><b>Kinh nghiệm:</b> {tutor.exp}</div>}
        {tutor.mode && <div><b>Hình thức:</b> {tutor.mode}</div>}
        {tutor.bioLong && <div className="mt-2">{tutor.bioLong}</div>}
      </Modal>
    </>
  );
}
