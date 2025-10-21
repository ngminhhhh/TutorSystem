import React from "react";

export default function StudentFilters({ disabled, criteria, setCriteria, onClear }) {
  const set = (k, v) => setCriteria((s) => ({ ...s, [k]: v }));

  return (
    <div className={disabled ? "filters-disabled" : ""}>
      <div className="filter-card mb-3">
        <div className="fw-bold mb-2">
          <i className="bi bi-sliders me-1" />
          Bộ tiêu chí
        </div>

        <label className="form-label mt-1 mb-1">Môn học</label>
        <select className="form-select" value={criteria.course} onChange={(e) => set("course", e.target.value)}>
          <option value="">-- Chọn --</option>
          <option>AI Fundamentals</option>
          <option>Algorithms</option>
          <option>Machine Learning</option>
        </select>

        <label className="form-label mt-3 mb-1">Chuyên môn</label>
        <select className="form-select" value={criteria.expertise} onChange={(e) => set("expertise", e.target.value)}>
          <option value="">-- Chọn --</option>
          <option>Computer Vision</option>
          <option>Data Mining</option>
          <option>Optimization</option>
        </select>

        <label className="form-label mt-3 mb-1">Kinh nghiệm</label>
        <select className="form-select" value={criteria.exp} onChange={(e) => set("exp", e.target.value)}>
          <option value="">-- Chọn --</option>
          <option>{">= 1 năm"}</option>
          <option>{">= 3 năm"}</option>
          <option>{">= 5 năm"}</option>
        </select>

        <label className="form-label mt-3 mb-1">Trình độ</label>
        <select className="form-select" value={criteria.degree} onChange={(e) => set("degree", e.target.value)}>
          <option value="">-- Chọn --</option>
          <option>Cử nhân</option>
          <option>Thạc sĩ</option>
          <option>Tiến sĩ</option>
        </select>

        <label className="form-label mt-3 mb-1">Đánh giá (sao)</label>
        <select className="form-select" value={criteria.rating} onChange={(e) => set("rating", e.target.value)}>
          <option value="">-- Từ --</option>
          <option>1+</option>
          <option>2+</option>
          <option>3+</option>
          <option>4+</option>
          <option>5</option>
        </select>

        <label className="form-label mt-3 mb-1">Số SV đang nhận</label>
        <select className="form-select" value={criteria.capacity} onChange={(e) => set("capacity", e.target.value)}>
          <option value="">-- Chọn --</option>
          <option>{"> 10"}</option>
          <option>{"> 20"}</option>
          <option>{"> 30"}</option>
        </select>

        <label className="form-label mt-3 mb-1">Chứng chỉ (optional)</label>
        <input
          className="form-control"
          placeholder="VD: AWS, Coursera DL..."
          value={criteria.cert || ""}
          onChange={(e) => set("cert", e.target.value)}
        />

        <button className="btn btn-outline-secondary w-100 mt-3 btn-round" onClick={onClear}>
          Xoá tiêu chí
        </button>
      </div>
    </div>
  );
}
