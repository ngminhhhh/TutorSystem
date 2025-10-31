import React, { useMemo, useState } from "react";

export default function ProfilePage({ user, onUpdate }) {
  // seed từ user hiện tại (mock nếu thiếu)
  const seed = {
    fullName: user?.name || "Student User",
    role: user?.role || "student",
    studentId: "20123xxx",
    email: user?.email || "student@hcmut.edu.vn",
    phone: "",
    major: "Computer Science",
    year: "3",
    location: "TP.HCM",
    skills: ["Python", "Machine Learning"],
    avatar: user?.avatar || "https://i.pravatar.cc/160?img=2",
    about:
      "Mình là sinh viên năm 3 CS, quan tâm đến ML/Autostore & ITS.\n" +
      "Thích đồ án thực chiến, code sạch, và tối ưu hiệu năng.",
  };

  const [form, setForm] = useState(seed);
  const [preview, setPreview] = useState(false);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(seed), [form]); // so sánh đơn giản

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange("avatar", url);
  };

  const addSkill = (e) => {
    e.preventDefault();
    const v = e.target.elements.skill.value.trim();
    if (!v) return;
    if (!form.skills.includes(v)) onChange("skills", [...form.skills, v]);
    e.target.reset();
  };

  const removeSkill = (s) =>
    onChange("skills", form.skills.filter((x) => x !== s));

  const save = () => {
    // mock: cập nhật ra ngoài nếu cần
    onUpdate?.(form);
    alert("Đã lưu hồ sơ (mock).");
  };

  const reset = () => setForm(seed);

  return (
    <div className="row g-3">
      {/* MAIN */}
      <div className="col-lg-8">
        {/* Box 1: Thông tin cá nhân */}
        <div className="post-card mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Thông tin cá nhân</h5>
            <div>
              <button
                className="btn btn-outline-secondary me-2 btn-round"
                disabled={!dirty}
                onClick={reset}
              >
                Huỷ thay đổi
              </button>
              <button
                className="btn btn-bk btn-round"
                disabled={!dirty}
                onClick={save}
              >
                Lưu
              </button>
            </div>
          </div>
          <hr />

          <div className="d-flex align-items-center mb-3" style={{ gap: 16 }}>
            <img className="profile-avatar" src={form.avatar} alt="avatar" />
            <div>
              <div className="fw-bold">{form.fullName}</div>
              <div className="text-muted small">{form.role}</div>
              <label className="btn btn-sm btn-outline-secondary mt-2">
                Đổi ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickAvatar}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Họ và tên</label>
              <input
                className="form-control"
                value={form.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Mã số (Student ID)</label>
              <input
                className="form-control"
                value={form.studentId}
                onChange={(e) => onChange("studentId", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Ngành</label>
              <input
                className="form-control"
                value={form.major}
                onChange={(e) => onChange("major", e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Năm học</label>
              <select
                className="form-select"
                value={form.year}
                onChange={(e) => onChange("year", e.target.value)}
              >
                <option>1</option><option>2</option>
                <option>3</option><option>4</option><option>5</option>
              </select>
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Khu vực</label>
              <input
                className="form-control"
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="form-label">Kỹ năng (tags)</label>
            <div className="d-flex flex-wrap" style={{ gap: 8 }}>
              {form.skills.map((s) => (
                <span key={s} className="tutor-tag d-inline-flex align-items-center">
                  {s}
                  <button
                    type="button"
                    className="btn btn-icon btn-ghost-danger ms-1"
                    onClick={() => removeSkill(s)}
                    title="Xoá"
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </span>
              ))}
            </div>
            <form className="d-flex mt-2" onSubmit={addSkill} style={{ gap: 8 }}>
              <input name="skill" className="form-control" placeholder="Thêm kỹ năng…" />
              <button className="btn btn-outline-secondary btn-round">Thêm</button>
            </form>
          </div>
        </div>

        {/* Box 2: Giới thiệu bản thân */}
        <div className="post-card">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Giới thiệu bản thân</h5>
            <div className="text-muted small">
              {form.about.length}/1000
              <div className="form-check d-inline-block ms-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={preview}
                  onChange={(e) => setPreview(e.target.checked)}
                  id="togglePreview"
                />
                <label className="form-check-label" htmlFor="togglePreview">
                  Xem trước
                </label>
              </div>
            </div>
          </div>
          <hr />
          {!preview ? (
            <textarea
              className="form-control"
              style={{ minHeight: 160 }}
              maxLength={1000}
              value={form.about}
              onChange={(e) => onChange("about", e.target.value)}
              placeholder="Viết vài dòng nổi bật: dự án, sở trường, cách dạy-học ưa thích, link GitHub…"
            />
          ) : (
            <div className="about-preview">
              {form.about.split("\n").map((ln, i) => (
                <p key={i} className="mb-2">{ln || <>&nbsp;</>}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR (tuỳ chọn xem nhanh) */}
      <div className="col-lg-4">
        <div className="filter-card">
          <div className="fw-bold mb-2">Bản xem trước công khai</div>
          <div className="d-flex align-items-center" style={{ gap: 12 }}>
            <img className="profile-avatar" src={form.avatar} alt="" />
            <div>
              <div className="fw-bold">{form.fullName}</div>
              <div className="text-muted small">
                {form.role} • {form.major} • Năm {form.year}
              </div>
            </div>
          </div>
          <div className="mt-2 d-flex flex-wrap" style={{ gap: 6 }}>
            {form.skills.map((s) => (
              <span key={s} className="tutor-tag">{s}</span>
            ))}
          </div>
          <div className="text-muted small mt-2">
            {form.about.slice(0, 140)}{form.about.length > 140 ? "…" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
