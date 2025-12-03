// src/pages/MatchingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import StudentSearch from "../components/matching/StudentSearch";
import StudentFilters from "../components/matching/StudentFilters";
import TutorCard from "../components/matching/TutorCard";
import TutorRequests from "../components/matching/TutorRequests";
import PendingRequestsSidebar from "../components/matching/PendingRequestsSidebar";
import Modal from "../components/common/Modal";

// fallback nếu server chết
const FALLBACK_TUTORS = [
  {
    id: "t_datle",
    username: "teacher",
    name: "Đạt Lê",
    title: "Tutor • ML",
    avatar: "https://i.pravatar.cc/80?img=20",
    rating: 4.6,
    tags: ["Machine Learning", "Python", "Optimization"],
    exp: "5+ năm",
    bio: "Cheat-sheet master, dạy ML thực chiến.",
    bioLong:
      "Đã hướng dẫn 30+ nhóm đồ án, tập trung optimization, regularization, keras/pytorch."
  },
  {
    id: "t_thaotran",
    username: "t_algo",
    name: "Thảo Trần",
    title: "TA • Algorithms",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 4.2,
    tags: ["Algorithms", "C++", "Graph"],
    exp: "3+ năm",
    bio: "Giải thuật & luyện thi theo đề cương.",
    bioLong: "Chuyên đồ thị, DP; kinh nghiệm coaching đội tuyển."
  }
];

export default function MatchingPage({ user }) {
  const role = String(user?.role || "student").toLowerCase();
  const isTutor = ["tutor", "teacher"].includes(role);
  const username = user?.username;

  // ======= STATE CHÍNH =======
  const [tutors, setTutors] = useState(FALLBACK_TUTORS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Đạt Lê", "Thảo Trần"]);
  const [criteria, setCriteria] = useState({
    course: "",
    expertise: "",
    exp: "",
    degree: "",
    rating: "",
    capacity: "",
    cert: ""
  });
  const [profileComplete, setProfileComplete] = useState(false);
  const [finding, setFinding] = useState(false);
  const [ok, setOk] = useState({ open: false, text: "" });

  // Pending của student (sidebar phải)
  const [pending, setPending] = useState([]);

  // ======= LOAD TUTORS TỪ BACKEND =======
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch("http://localhost:4000/api/tutors");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json(); // mảng user role=tutor

        const mapped = data.map((u, idx) => ({
          id: u.username || u.id || `t_${idx}`,
          username: u.username,
          name: u.name,
          title: u.major ? `Tutor • ${u.major}` : "Tutor",
          avatar:
            u.avatar ||
            `https://i.pravatar.cc/80?u=${encodeURIComponent(
              u.username || u.name
            )}`,
          rating: u.rating ?? 4.5,
          tags: u.skills || [],
          exp: u.year ? `${u.year}+ năm` : "—",
          bio: u.bio || u.about || "Tutor tại BK LMS.",
          bioLong:
            u.about ||
            u.bio ||
            "Tutor trong hệ thống hỗ trợ học tập, tập trung kèm cặp 1-1 và theo nhóm."
        }));

        setTutors(mapped);
      } catch (err) {
        console.error("Không load được tutor từ server, dùng fallback:", err);
        setLoadError(
          "Không tải được danh sách tutor từ server, đang dùng dữ liệu mẫu."
        );
        setTutors(FALLBACK_TUTORS);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ======= LOAD PENDING REQUESTS CỦA STUDENT =======
  useEffect(() => {
    if (!username || isTutor) return;

    const loadPending = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/matching/requests?role=student&username=${encodeURIComponent(
            username
          )}&status=pending`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const mapped = data.map((r) => ({
          id: r.id,
          tutor: {
            id: r.tutor?.username || r.tutorUsername,
            name: r.tutor?.name || r.tutorUsername,
            avatar:
              r.tutor?.avatar ||
              `https://i.pravatar.cc/80?u=${encodeURIComponent(
                r.tutorUsername
              )}`,
            specialty:
              r.tutor?.major ||
              r.tutor?.role ||
              "Tutor"
          },
          sentAt: new Date(r.createdAt).toLocaleString("vi-VN")
        }));
        setPending(mapped);
      } catch (e) {
        console.error("Không load được pending của student:", e);
      }
    };

    loadPending();
  }, [username, isTutor]);

  const pendingIds = new Set(pending.map((r) => r.tutor.id));

  // ======= GỬI LỜI MỜI GHÉP CẶP =======
  const sendRequest = async (tutor) => {
    if (!username) {
      setOk({
        open: true,
        text: "Bạn cần đăng nhập để gửi yêu cầu."
      });
      return;
    }

    if (!tutor.username) {
      setOk({
        open: true,
        text: "Tutor này không có username hợp lệ (mock fallback)."
      });
      return;
    }

    if (pendingIds.has(tutor.id)) {
      setOk({ open: true, text: `Bạn đã gửi yêu cầu cho ${tutor.name}.` });
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/matching/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorUsername: tutor.username,
          studentUsername: username
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const req = {
        id: data.id,
        tutor: {
          id: data.tutor?.username || data.tutorUsername,
          name: data.tutor?.name || tutor.name,
          avatar: data.tutor?.avatar || tutor.avatar,
          specialty:
            data.tutor?.major || tutor.tags?.[0] || tutor.title || "Tutor"
        },
        sentAt: new Date(data.createdAt).toLocaleString("vi-VN")
      };

      setPending((prev) => [req, ...prev]);
      setOk({
        open: true,
        text: `Đã gửi yêu cầu ghép cặp đến ${req.tutor.name}.`
      });
    } catch (e) {
      console.error("Lỗi khi gửi request:", e);
      setOk({
        open: true,
        text: "Lỗi khi gửi yêu cầu ghép cặp. Thử lại sau."
      });
    }
  };

  const cancelRequest = (reqId) => {
    // hiện tại chỉ xoá local; nếu muốn có thể thêm API DELETE sau
    setPending((prev) => prev.filter((r) => r.id !== reqId));
  };

  // ======= SEARCH & FILTER =======
  const searchNow = () => {
    if (query.trim()) {
      setRecent((r) => [query, ...r.filter((x) => x !== query)].slice(0, 5));
    }
  };

  const filtered = useMemo(() => {
    let arr = [...tutors];

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (criteria.course) arr = arr.filter((t) => t.tags.includes(criteria.course));
    if (criteria.expertise) arr = arr.filter((t) => t.tags.includes(criteria.expertise));
    if (criteria.rating)
      arr = arr.filter((t) => t.rating >= parseInt(criteria.rating[0], 10));

    return arr;
  }, [tutors, query, criteria]);

  const autoSuggest = () => {
    if (!profileComplete) {
      setOk({
        open: true,
        text: "Vui lòng hoàn thiện hồ sơ (Profile) để dùng tính năng đề xuất."
      });
      return;
    }
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setOk({
        open: true,
        text: "Đã đề xuất một số trợ giảng phù hợp dựa trên hồ sơ của bạn (mock)."
      });
    }, 900);
  };

  // ======= TUTOR VIEW =======
  if (isTutor) {
    return <TutorRequests user={user} />;
  }

  // ======= STUDENT VIEW =======
  return (
    <>
      <div className="row g-3">
        {/* LEFT: auto suggest + filter */}
        <div className="col-lg-3 order-2 order-lg-1">
          <div className="filter-card mb-3">
            <div className="fw-bold mb-2">
              <i className="bi bi-magic me-1" /> Tự động tìm trợ giảng
            </div>
            {!profileComplete ? (
              <>
                <div className="text-muted small">
                  Cần hoàn thiện hồ sơ để dùng tính năng này.
                </div>
                <button
                  className="btn btn-outline-secondary w-100 mt-2 btn-round"
                  onClick={() => setProfileComplete(true)}
                >
                  (Mock) Đánh dấu hồ sơ đã đầy đủ
                </button>
              </>
            ) : (
              <button
                className="btn btn-bk w-100 btn-round"
                onClick={autoSuggest}
                disabled={finding}
              >
                {finding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Đang đề xuất…
                  </>
                ) : (
                  "Đề xuất trợ giảng"
                )}
              </button>
            )}
          </div>

          <StudentFilters
            disabled={!!query.trim()}
            criteria={criteria}
            setCriteria={setCriteria}
            onClear={() =>
              setCriteria({
                course: "",
                expertise: "",
                exp: "",
                degree: "",
                rating: "",
                capacity: "",
                cert: ""
              })
            }
          />
        </div>

        {/* CENTER: search + tutors */}
        <div className="col-lg-6 order-1 order-lg-2">
          <StudentSearch
            query={query}
            setQuery={setQuery}
            onSubmit={searchNow}
            recent={recent}
            trending={tutors
              .slice(0, 3)
              .map((t) => `${t.name} • ${(t.tags && t.tags[0]) || t.title}`)}
            onPick={searchNow}
          />

          {loadError && (
            <div className="alert alert-warning small mt-2">{loadError}</div>
          )}
          {loading && (
            <div className="text-muted small mb-2">
              Đang tải danh sách trợ giảng…
            </div>
          )}

          {filtered.map((t) => (
            <TutorCard
              key={t.id}
              tutor={t}
              onRequest={() => sendRequest(t)}
              isPending={pendingIds.has(t.id)}
            />
          ))}

          {!loading && filtered.length === 0 && (
            <div className="post-card text-muted">
              Không có kết quả phù hợp.
            </div>
          )}
        </div>

        {/* RIGHT: pending requests của student */}
        <div className="col-lg-3 order-3">
          <div className="sidebar">
            <PendingRequestsSidebar requests={pending} onCancel={cancelRequest} />
          </div>
        </div>
      </div>

      <Modal
        open={ok.open}
        title="Thông báo"
        onClose={() => setOk({ open: false, text: "" })}
        actions={null}
      >
        {ok.text}
      </Modal>
    </>
  );
}
