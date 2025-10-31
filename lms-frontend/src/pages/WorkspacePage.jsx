import React, { useMemo, useState } from "react";
import SpaceSidebar from "../components/workspace/SpaceSidebar";
import SpaceHeader from "../components/workspace/SpaceHeader";
import PostComposer from "../components/workspace/PostComposer";
import PostCard from "../components/workspace/PostCard";
import FilesPanel from "../components/workspace/FilesPanel";
import MeetingsPanel from "../components/workspace/MeetingsPanel";
// import UpcomingMeetings from "../components/workspace/UpcomingMeetings";

const seedUser = { id:"u2", name:"Student User", role:"student", avatar:"https://i.pravatar.cc/80?img=2" };

const seedSpaces = [
  {
    id:"s1",
    name:"ML – Dat Le",
    members:[
      {id:"u1", name:"Dat Le", role:"tutor", avatar:"https://i.pravatar.cc/80?img=20"},
      {id:"u2", name:"Student User", role:"student", avatar:"https://i.pravatar.cc/80?img=2"},
      {id:"u3", name:"Khoa Vu", role:"student", avatar:"https://i.pravatar.cc/80?img=12"},
    ],
    posts:[
      {id:"p1", authorId:"u1", content:"Chào lớp, tuần này ôn SGD + Momentum.\nĐọc trước chương 3.", pinned:true, createdAt:"2025-10-31 09:00", attachments:["slides-week1.pdf"]},
      {id:"p2", authorId:"u2", content:"Thầy ơi, assignment 1 nộp hạn mấy giờ ạ?", pinned:false, createdAt:"2025-10-31 10:21"},
    ],
    files:[
      {id:"f1", name:"slides-week1.pdf", size:"2.1MB", uploadedBy:"u1", createdAt:"2025-10-30"},
      {id:"f2", name:"reading-sgd.pdf", size:"1.4MB", uploadedBy:"u1", createdAt:"2025-10-30"},
    ],
    meetings:[
      {id:"m1", title:"Weekly Checkpoint", date:"2025-11-02", time:"09:30", duration:60, location:"Google Meet", link:"https://meet.google.com/mock-ml"},
    ]
  },
  {
    id:"s2",
    name:"Algorithms – Thao Tran",
    members:[
      {id:"u4", name:"Thao Tran", role:"tutor", avatar:"https://i.pravatar.cc/80?img=5"},
      {id:"u2", name:"Student User", role:"student", avatar:"https://i.pravatar.cc/80?img=2"},
    ],
    posts:[],
    files:[],
    meetings:[]
  }
];

export default function WorkspacePage({ user = seedUser }) {
  const [spaces, setSpaces] = useState(seedSpaces);
  const [activeId, setActiveId] = useState("s1");
  const active = useMemo(() => spaces.find(s => s.id===activeId), [spaces, activeId]);
  const isTutor = useMemo(() => {
    const me = active?.members.find(m=>m.id===user.id) || user;
    return String(me.role).toLowerCase()==="tutor";
  }, [active, user]);

  // Post
  const addPost = (text, attachments=[]) => {
    if (!text.trim()) return;
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({
      ...s,
      posts: [
        { id:"p_"+Math.random().toString(36).slice(2,8), authorId:user.id, content:text.trim(), pinned:false, createdAt:new Date().toISOString(), attachments },
        ...s.posts
      ]
    })));
  };
  const togglePin = (postId) => {
    if (!isTutor) return; // only tutors
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({
      ...s,
      posts: s.posts.map(p => p.id===postId ? {...p, pinned:!p.pinned} : p)
    })));
  };
  const deletePost = (postId) => {
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({
      ...s,
      posts: s.posts.filter(p => p.id!==postId)
    })));
  };

  // Files
  const uploadFile = (fileName, size="—") => {
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({
      ...s,
      files: [{ id:"f_"+Math.random().toString(36).slice(2,8), name:fileName, size, uploadedBy:user.id, createdAt:new Date().toISOString() }, ...s.files]
    })));
  };
  const removeFile = (fid) => {
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({ ...s, files: s.files.filter(f=>f.id!==fid) })));
  };

  // Meetings
  const addMeeting = (payload) => {
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({
      ...s,
      meetings: [{ id:"m_"+Math.random().toString(36).slice(2,8), ...payload }, ...s.meetings]
    })));
  };
  const cancelMeeting = (mid) => {
    setSpaces(prev => prev.map(s => s.id!==activeId ? s : ({ ...s, meetings: s.meetings.filter(m=>m.id!==mid) })));
  };

  if (!active) return <div className="text-muted">No workspace.</div>;

  const me = active.members.find(m=>m.id===user.id) || user;

  const pinned = active.posts.filter(p=>p.pinned);
  const normal = active.posts.filter(p=>!p.pinned);

  return (
    <div className="row g-3">
      {/* LEFT: spaces */}
      <div className="col-lg-3 order-2 order-lg-1">
        <div className="sidebar">
          <SpaceSidebar spaces={spaces} activeId={activeId} onSelect={setActiveId}/>
        </div>
      </div>

      {/* CENTER: feed */}
      <div className="col-lg-6 order-1 order-lg-2">
        <SpaceHeader space={active}/>
        <PostComposer onPost={addPost} />
        {pinned.length>0 && (
          <div className="post-card mb-3">
            <div className="fw-bold mb-2"><i className="bi bi-pin-angle-fill me-2"/>Pinned</div>
            {pinned.map(p=>(
              <PostCard key={p.id}
                        post={p}
                        author={active.members.find(m=>m.id===p.authorId)}
                        canPin={isTutor}
                        onPin={()=>togglePin(p.id)}
                        onDelete={()=>deletePost(p.id)} />
            ))}
          </div>
        )}
        {normal.map(p=>(
          <PostCard key={p.id}
                    post={p}
                    author={active.members.find(m=>m.id===p.authorId)}
                    canPin={isTutor}
                    onPin={()=>togglePin(p.id)}
                    onDelete={()=>deletePost(p.id)} />
        ))}
        {active.posts.length===0 && <div className="post-card text-muted">Chưa có bài viết nào.</div>}
      </div>

      {/* RIGHT: Files + Meetings */}
      <div className="col-lg-3 order-3">
        <div className="sidebar">
          <FilesPanel files={active.files} spaceMembers={active.members}
                      canManage={isTutor /* hoặc cho student upload tùy bạn */}
                      onUpload={uploadFile} onRemove={removeFile}/>
          <div className="mt-3"/>
            <MeetingsPanel meetings={active.meetings} canManage={true}
                        onCreate={addMeeting} onCancel={cancelMeeting}/>
        </div>
      </div>
    </div>
  );
}
