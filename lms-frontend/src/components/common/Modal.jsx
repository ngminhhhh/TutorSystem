import React from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="bk-modal__backdrop" onClick={onClose}>
      <div className="bk-modal__card" onClick={(e)=>e.stopPropagation()}>
        <div className="bk-modal__head">{title}</div>
        <div className="bk-modal__body">{children}</div>
        <div className="bk-modal__foot">
          {actions}
          <button className="btn btn-outline-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
