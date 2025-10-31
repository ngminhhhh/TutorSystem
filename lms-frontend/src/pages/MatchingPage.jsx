import React, { useMemo, useState } from "react";
import StudentSearch from "../components/matching/StudentSearch";
import StudentFilters from "../components/matching/StudentFilters";
import TutorCard from "../components/matching/TutorCard";
import TutorRequests from "../components/matching/TutorRequests";
import PendingRequestsSidebar from "../components/matching/PendingRequestsSidebar";
import Modal from "../components/common/Modal";

const seedTutors = [
  { id:1, name:"Dat Le",   title:"Tutor • ML",         avatar:"https://i.pravatar.cc/80?img=20", rating:4.6,
    tags:["Machine Learning","Python","Optimization"], exp:"5+ năm", bio:"Cheat-sheet master, dạy ML thực chiến.",
    bioLong:"Đã hướng dẫn 30+ nhóm đồ án, tập trung optimization, regularization, keras/pytorch." },
  { id:2, name:"Thao Tran", title:"TA • Algorithms",   avatar:"https://i.pravatar.cc/80?img=5",  rating:4.2,
    tags:["Algorithms","C++","Graph"],                exp:"3+ năm", bio:"Giải thuật & luyện thi theo đề cương.",
    bioLong:"Chuyên đồ thị, DP; kinh nghiệm coaching đội tuyển." },
  { id:3, name:"Minh Nguyen", title:"CS Student",      avatar:"https://i.pravatar.cc/80?img=1",  rating:4.0,
    tags:["AI Fundamentals","Python"],                exp:"1+ năm", bio:"Hỗ trợ nền tảng AI căn bản.",
    bioLong:"Giải thích trực quan, slides gọn, code sạch." },
];

const seedPending = [
  {
    id: "r1",
    tutor: {
      id: 1,
      name: "Dat Le",
      avatar: "https://i.pravatar.cc/80?img=20",
      specialty: "Machine Learning"
    },
    sentAt: "2m"
  }
];

export default function MatchingPage({ user }) {
  const role = String(user?.role || "student").toLowerCase();
  const isTutor = ["tutor", "teacher"].includes(role);

  // ----- Student view state
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Dat Le", "Thao Tran"]);
  const [criteria, setCriteria] = useState({
    course:"", expertise:"", exp:"", degree:"", rating:"", capacity:"", cert:""
  });
  const [profileComplete, setProfileComplete] = useState(false);
  const [finding, setFinding] = useState(false);
  const [ok, setOk] = useState({ open:false, text:"" });

  // ---- NEW: Pending connect requests (right sidebar)
  const [pending, setPending] = useState(seedPending);
  const pendingIds = new Set(pending.map(r => r.tutor.id));

  const sendRequest = (tutor) => {
    // tránh trùng
    if (pendingIds.has(tutor.id)) {
      setOk({ open:true, text:`Bạn đã gửi yêu cầu cho ${tutor.name}.` });
      return;
    }
    const req = {
      id: "r_" + Math.random().toString(36).slice(2,8),
      tutor: {
        id: tutor.id,
        name: tutor.name,
        avatar: tutor.avatar,
        specialty: tutor.tags?.[0] || tutor.title || "Tutor"
      },
      sentAt: "now"
    };
    setPending(prev => [req, ...prev]);
    setOk({ open:true, text:`Đã gửi yêu cầu ghép cặp đến ${tutor.name}.` });
  };

  const cancelRequest = (reqId) => {
    setPending(prev => prev.filter(r => r.id !== reqId));
  };

  // search
  const searchNow = () => {
    if (query.trim())
      setRecent(r => [query, ...r.filter(x => x !== query)].slice(0, 5));
  };

  const filtered = useMemo(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return seedTutors.filter(
        t => t.name.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
      );
    }
    let arr = [...seedTutors];
    if (criteria.course)    arr = arr.filter(t => t.tags.includes(criteria.course));
    if (criteria.expertise) arr = arr.filter(t => t.tags.includes(criteria.expertise));
    if (criteria.rating)    arr = arr.filter(t => t.rating >= parseInt(criteria.rating[0], 10));
    return arr;
  }, [query, criteria]);

  const autoSuggest = () => {
    if (!profileComplete) {
      setOk({ open:true, text:"Vui lòng hoàn thiện hồ sơ (User Management) để dùng tính năng đề xuất." });
      return;
    }
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setOk({ open:true, text:"Đã đề xuất 2 trợ giảng phù hợp dựa trên hồ sơ của bạn (mock)." });
    }, 900);
  };

  if (isTutor) {
    return <TutorRequests />;
  }

  // ----- Student view layout: Left 3 / Center 6 / Right 3
  return (
    <>
      <div className="row g-3">
        {/* LEFT */}
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
                course:"", expertise:"", exp:"", degree:"", rating:"", capacity:"", cert:""
              })
            }
          />
        </div>

        {/* CENTER */}
        <div className="col-lg-6 order-1 order-lg-2">
          <StudentSearch
            query={query}
            setQuery={setQuery}
            onSubmit={searchNow}
            recent={recent}
            trending={["Dat Le • ML", "Thao Tran • Algorithms", "Minh Nguyen • AI"]}
            onPick={searchNow}
          />

          {filtered.map((t) => (
            <TutorCard
              key={t.id}
              tutor={t}
              onRequest={() => sendRequest(t)}
              isPending={pendingIds.has(t.id)}   // <-- dùng để disable nút
            />
          ))}
          {filtered.length === 0 && (
            <div className="post-card text-muted">Không có kết quả phù hợp.</div>
          )}
        </div>

        {/* RIGHT: pending requests */}
        <div className="col-lg-3 order-3">
          <div className="sidebar">
            <PendingRequestsSidebar
              requests={pending}
              onCancel={cancelRequest}
            />
          </div>
        </div>
      </div>

      <Modal open={ok.open} title="Thông báo" onClose={() => setOk({ open:false, text:"" })} actions={null}>
        {ok.text}
      </Modal>
    </>
  );
}
