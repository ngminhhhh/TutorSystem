import React, { useMemo, useState } from "react";
import FiltersSidebar from "../components/feed/FiltersSidebar";
import Composer from "../components/feed/Composer";
import PostCard from "../components/feed/PostCard";
import MessagesSidebar from "../components/messages/MessagesSidebar";
import ChatDrawer from "../components/messages/ChatDrawer";

const seedPosts = [
  { id:1, author:{name:"Minh Nguyen", title:"CS Student", avatar:"https://i.pravatar.cc/80?img=1"}, time:"5m", type:"Announcement", course:"AI Fundamentals", content:"Welcome to the Community Dashboard! Please read the posting guidelines pinned at the top.", likes:12, comments:3 },
  { id:2, author:{name:"Dat Le", title:"Tutor - ML", avatar:"https://i.pravatar.cc/80?img=14"}, time:"3h", type:"Share", course:"Machine Learning", content:"I uploaded a concise cheat-sheet for gradient-based optimization used in our labs.", likes:27, comments:9 },
  { id:3, author:{name:"Thao Tran", title:"TA - Algorithms", avatar:"https://i.pravatar.cc/80?img=5"}, time:"1h", type:"Question", course:"Algorithms", content:"Any clean proof sketch for Dijkstra correctness under non-negative weights?", likes:8, comments:5 },
];

// Current login user (student)
const me = { id:"u1", name:"Student User", role:"student", avatar:"https://i.pravatar.cc/80?img=15" };

// Conversations (student ↔ student only)
const seedConvos = [
  {
    id:"c1",
    other:{ id:"u2", name:"Lan Pham", avatar:"https://i.pravatar.cc/80?img=48" },
    online:true, lastAt:"2m", unread:1,
    messages:[
      { id:"m1", from:"u2", text:"Hi, did you finish Assignment 2?", time:"09:12" },
      { id:"m2", from:"u1", text:"Almost there!", time:"09:14" }
    ]
  },
  {
    id:"c2",
    other:{ id:"u3", name:"Khoa Vu", avatar:"https://i.pravatar.cc/80?img=12" },
    online:false, lastAt:"1h", unread:0,
    messages:[ { id:"m1", from:"u3", text:"Do you have the lab template?", time:"08:03" } ]
  }
];

export default function CommunityPage() {
  // Feed state
  const [posts, setPosts] = useState(seedPosts);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [course, setCourse] = useState("ALL");
  const [sort, setSort] = useState("new");

  // Messages state
  const [convos, setConvos] = useState(seedConvos);
  const [openId, setOpenId] = useState(null);
  const activeConvo = useMemo(() => convos.find((c) => c.id === openId), [convos, openId]);

  const filtered = useMemo(() => {
    let arr = [...posts];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.course.toLowerCase().includes(q)
      );
    }
    if (type !== "ALL") arr = arr.filter((p) => p.type === type);
    if (course !== "ALL") arr = arr.filter((p) => p.course === course);
    if (sort === "top") arr.sort((a,b)=> b.likes - a.likes);
    else arr.sort((a,b)=> String(b.time).localeCompare(String(a.time)));
    return arr;
  }, [posts, query, type, course, sort]);

  const openChat = (id) => setOpenId(id);
  const closeChat = () => setOpenId(null);

  const sendMessage = (text) => {
    setConvos((cs) =>
      cs.map((c) => {
        if (c.id !== openId) return c;
        const msg = {
          id: "m" + (c.messages.length + 1),
          from: me.id,
          text,
          time: new Date().toLocaleTimeString().slice(0,5)
        };
        return { ...c, messages: [...c.messages, msg], lastAt: "now", unread: 0 };
      })
    );
  };

  return (
    <>
      <div className="row g-3">
        {/* LEFT: Filters */}
        <div className="col-lg-3 order-2 order-lg-1">
          <FiltersSidebar
            query={query} setQuery={setQuery}
            type={type} setType={setType}
            course={course} setCourse={setCourse}
            sort={sort} setSort={setSort}
          />
        </div>

        {/* CENTER: Feed */}
        <div className="col-lg-6 order-1 order-lg-2">
          <Composer onPost={(p) => setPosts([p, ...posts])} />
          {filtered.map((p) => (
            <PostCard key={p.id} p={p} />
          ))}
        </div>

        {/* RIGHT: Messages */}
        <div className="col-lg-3 order-3">
          <MessagesSidebar convos={convos} onOpen={openChat} />
        </div>
      </div>

      <ChatDrawer
        open={!!activeConvo}
        conversation={activeConvo}
        me={me}
        onClose={closeChat}
        onSend={sendMessage}
      />
    </>
  );
}
