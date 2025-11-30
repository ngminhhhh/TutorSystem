// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000"; // đổi nếu server dùng port khác

// map từ user (từ backend / App) sang form model
function toFormModel(user) {
  if (!user) user = {};
  return {
    fullName: user.name || "Student User",
    role: user.role || "student",
    studentId: user.studentId || "20123xxx",
    email: user.email || "student@hcmut.edu.vn",
    phone: user.phone || "",
    major: user.major || "Computer Science",
    year: user.year || "3",
    location: user.location || "TP.HCM",
    skills: Array.isArray(user.skills) && user.skills.length
      ? [...user.skills]
      : ["Python", "Machine Learning"],
    avatar:
      user.avatar ||
      "https://i.pravatar.cc/160?img=2",
    about:
      user.about ||
      ("Mình là sinh viên năm 3 CS, quan tâm đến ML/Autostore & ITS.\n" +
        "Thích đồ án thực chiến, code sạch, và tối ưu hiệu năng."),
  };
}

// map từ form model về user object gửi backend
function toServerPayload(user, form) {
  // giữ lại id, username, các field khác của user
  const base = user || {};
  return {
    ...base,
    name: form.fullName,
    role: form.role,
    studentId: form.studentId,
    email: form.email,
    phone: form.phone,
    major: form.major,
    year: form.year,
    location: form.location,
    skills: form.skills,
    avatar: form.avatar,
    about: form.about,
  };
}

export default function ProfilePage({ user, onUpdate }) {
  // ===== state chính
  const [original, setOriginal] = useState(() => toFormModel(user));
  const [form, setForm] = useState(() => toFormModel(user));
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // khi user (prop) thay đổi hoặc khi load lại từ backend,
  // ta sync form theo user
  useEffect(() => {
    const syncFromUser = async () => {
      if (!user?.username) {
        const model = toFormModel(user);
        setOriginal(model);
        setForm(model);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/users/${encodeURIComponent(user.username)}`
        );
        if (res.ok) {
          const full = await res.json();
          const model = toFormModel(full);
          setOriginal(model);
          setForm(model);
          // sync lại App nếu backend có thêm field mới
          onUpdate?.(full);
        } else {
          // nếu lỗi thì fallback về prop user
          const model = toFormModel(user);
          setOriginal(model);
          setForm(model);
        }
      } catch (e) {
        console.error("Load profile failed:", e);
        const model = toFormModel(user);
        setOriginal(model);
        setForm(model);
      } finally {
        setLoading(false);
      }
    };

    syncFromUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]); // chỉ phụ thuộc username

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(original),
    [form, original]
  );

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

  const save = async () => {
    if (!user?.username) {
      alert("Không xác định được username, không thể lưu.");
      return;
    }
    try {
      setSaving(true);
      const payload = toServerPayload(user, form);
      const res = await fetch(
        `${API_BASE}/api/users/${encodeURIComponent(user.username)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        throw new Error("Server trả về lỗi khi lưu hồ sơ.");
      }
      const updated = await res.json();
      const model = toFormModel(updated);

      setOriginal(model);
      setForm(model);
      // cập nhật state global ở App + localStorage
      onUpdate?.(updated);

      alert("Đã lưu hồ sơ.");
    } catch (e) {
      console.error(e);
      alert("Lưu hồ sơ thất bại, kiểm tra server hoặc console.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setForm(original);

  return (
    <div className="row g-3">
      {/* MAIN */}
      <div className="col-lg-8">
        {/* Box 1: Thông tin cá nhân */}
        <div className="post-card mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Thông tin cá nhân{" "}
              {loading && (
                <span className="text-muted small ms-2">
                  (Đang tải từ server…)
                </span>
              )}
            </h5>
            <div>
              <button
                className="btn btn-outline-secondary me-2 btn-round"
                disabled={!dirty || saving}
                onClick={reset}
              >
                Huỷ thay đổi
              </button>
              <button
                className="btn btn-bk btn-round"
                disabled={!dirty || saving}
                onClick={save}
              >
                {saving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </div>
          <hr />

          <div
            className="d-flex align-items-center mb-3"
            style={{ gap: 16 }}
          >
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
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
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
                <span
                  key={s}
                  className="tutor-tag d-inline-flex align-items-center"
                >
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
            <form
              className="d-flex mt-2"
              onSubmit={addSkill}
              style={{ gap: 8 }}
            >
              <input
                name="skill"
                className="form-control"
                placeholder="Thêm kỹ năng…"
              />
              <button className="btn btn-outline-secondary btn-round">
                Thêm
              </button>
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
                <label
                  className="form-check-label"
                  htmlFor="togglePreview"
                >
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
                <p key={i} className="mb-2">
                  {ln || <>&nbsp;</>}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR: preview nhanh */}
      <div className="col-lg-4">
        <div className="filter-card">
          <div className="fw-bold mb-2">Bản xem trước công khai</div>
          <div
            className="d-flex align-items-center"
            style={{ gap: 12 }}
          >
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
              <span key={s} className="tutor-tag">
                {s}
              </span>
            ))}
          </div>
          <div className="text-muted small mt-2">
            {form.about.slice(0, 140)}
            {form.about.length > 140 ? "…" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
