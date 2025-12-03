// src/pages/WorkspacePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import SpaceSidebar from "../components/workspace/SpaceSidebar";
import SpaceHeader from "../components/workspace/SpaceHeader";
import PostComposer from "../components/workspace/PostComposer";
import PostCard from "../components/workspace/PostCard";
import FilesPanel from "../components/workspace/FilesPanel";
import SpaceSubnav from "../components/workspace/SpaceSubnav";
import MeetingsBoard from "../components/workspace/MeetingsBoard";

export default function WorkspacePage({ user }) {
  const username = user?.username;
  const [spaces, setSpaces] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("feed"); // 'feed' | 'meetings'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load workspaces từ backend
  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://localhost:4000/api/workspaces?username=${encodeURIComponent(
            username
          )}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (data || []).map((ws) => ({
          posts: [],
          files: [],
          meetings: [],
          ...ws,
          posts: ws.posts || [],
          files: ws.files || [],
          meetings: ws.meetings || []
        }));
        setSpaces(normalized);
        if (!activeId && normalized.length > 0) {
          setActiveId(normalized[0].id);
        }
      } catch (e) {
        console.error("Load workspaces fail:", e);
        setError("Không tải được danh sách workspace.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, activeId]);

  const active = useMemo(
    () => spaces.find((s) => s.id === activeId) || spaces[0] || null,
    [spaces, activeId]
  );

  const isTutor = useMemo(() => {
    if (!active) return false;
    const me =
      active.members?.find(
        (m) => m.username === username || m.id === username
      ) || user;
    return String(me?.role || "").toLowerCase() === "tutor";
  }, [active, username, user]);

  if (loading && spaces.length === 0) {
    return <div className="text-muted small">Đang tải workspace…</div>;
  }

  if (error && spaces.length === 0) {
    return <div className="text-danger small">{error}</div>;
  }

  if (!active) {
    return (
      <div className="post-card text-muted">
        Bạn chưa có workspace nào. Hãy gửi / chấp nhận yêu cầu trong{" "}
        <b>Tutor-Student Matching</b>.
      </div>
    );
  }

  // ===== FEED handlers (local-only)
  const addPost = (text, attachments = []) => {
    if (!text.trim()) return;
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              posts: [
                {
                  id: "p_" + Math.random().toString(36).slice(2, 8),
                  authorId: username,
                  content: text.trim(),
                  pinned: false,
                  createdAt: new Date().toISOString(),
                  attachments
                },
                ...s.posts
              ]
            }
      )
    );
  };

  const togglePin = (postId) => {
    if (!isTutor) return;
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              posts: s.posts.map((p) =>
                p.id === postId ? { ...p, pinned: !p.pinned } : p
              )
            }
      )
    );
  };

  const deletePost = (postId) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : { ...s, posts: s.posts.filter((p) => p.id !== postId) }
      )
    );
  };

  // FILE handlers
  const uploadFile = (fileName, size = "—") => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              files: [
                {
                  id: "f_" + Math.random().toString(36).slice(2, 8),
                  name: fileName,
                  size,
                  uploadedBy: username,
                  createdAt: new Date().toISOString()
                },
                ...s.files
              ]
            }
      )
    );
  };

  const removeFile = (fid) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : { ...s, files: s.files.filter((f) => f.id !== fid) }
      )
    );
  };

  // MEETING handlers (local-only)
  const addMeeting = (payload) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              meetings: [
                {
                  id: "m_" + Math.random().toString(36).slice(2, 8),
                  feedback: [],
                  summary: "",
                  ...payload
                },
                ...s.meetings
              ]
            }
      )
    );
  };

  const cancelMeeting = (mid) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : { ...s, meetings: s.meetings.filter((m) => m.id !== mid) }
      )
    );
  };

  const addFeedback = (mid, { text, rating }) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              meetings: s.meetings.map((m) =>
                m.id === mid
                  ? {
                      ...m,
                      feedback: [
                        ...(m.feedback || []),
                        { author: user.name, text, rating }
                      ]
                    }
                  : m
              )
            }
      )
    );
  };

  const summarizeMeeting = (mid) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== active.id
          ? s
          : {
              ...s,
              meetings: s.meetings.map((m) =>
                m.id === mid
                  ? {
                      ...m,
                      summary:
                        m.summary ||
                        "Tóm tắt (mock): đã thảo luận nội dung buổi học và giao bài tập."
                    }
                  : m
              )
            }
      )
    );
  };

  const pinned = (active.posts || []).filter((p) => p.pinned);
  const normal = (active.posts || []).filter((p) => !p.pinned);

  return (
    <div className="row g-3">
      {/* LEFT: danh sách workspace */}
      <div className="col-lg-3 order-2 order-lg-1">
        <div className="sidebar">
          <SpaceSidebar
            spaces={spaces}
            activeId={active.id}
            onSelect={setActiveId}
          />
        </div>
      </div>

      {/* CENTER: feed / meetings */}
      <div className="col-lg-6 order-1 order-lg-2">
        <SpaceHeader space={active} />
        <SpaceSubnav tab={tab} setTab={setTab} />

        {tab === "feed" && (
          <>
            <PostComposer onPost={addPost} />

            {pinned.length > 0 && (
              <div className="post-card mb-3">
                <div className="fw-bold mb-2">
                  <i className="bi bi-pin-angle-fill me-2" />
                  Pinned
                </div>
                {pinned.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    author={active.members.find(
                      (m) =>
                        m.username === p.authorId || m.id === p.authorId
                    )}
                    canPin={isTutor}
                    onPin={() => togglePin(p.id)}
                    onDelete={() => deletePost(p.id)}
                  />
                ))}
              </div>
            )}

            {normal.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                author={active.members.find(
                  (m) =>
                    m.username === p.authorId || m.id === p.authorId
                )}
                canPin={isTutor}
                onPin={() => togglePin(p.id)}
                onDelete={() => deletePost(p.id)}
              />
            ))}

            {active.posts.length === 0 && (
              <div className="post-card text-muted">
                Chưa có bài viết nào.
              </div>
            )}
          </>
        )}

        {tab === "meetings" && (
          <MeetingsBoard
            meetings={active.meetings || []}
            canManage={isTutor}
            onCreate={addMeeting}
            onCancel={cancelMeeting}
            onFeedback={addFeedback}
            onSummarize={summarizeMeeting}
          />
        )}
      </div>

      {/* RIGHT: Files */}
      <div className="col-lg-3 order-3">
        <div className="sidebar">
          <FilesPanel
            files={active.files || []}
            spaceMembers={active.members || []}
            canManage={isTutor}
            onUpload={uploadFile}
            onRemove={removeFile}
          />
        </div>
      </div>
    </div>
  );
}
