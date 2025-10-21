import React, { useMemo, useState } from 'react';
import FiltersSidebar from '../components/feed/FiltersSidebar';
import Composer from '../components/feed/Composer';
import PostCard from '../components/feed/PostCard';

const seedPosts = [
  { id:1, author:{name:"Minh Nguyen", title:"CS Student", avatar:"https://i.pravatar.cc/80?img=1"}, time:"5m", type:"Announcement", course:"AI Fundamentals", content:"Welcome to the Community Dashboard! Please read the posting guidelines pinned at the top.", likes:12, comments:3 },
  { id:2, author:{name:"Dat Le", title:"Tutor - ML", avatar:"https://i.pravatar.cc/80?img=14"}, time:"3h", type:"Share", course:"Machine Learning", content:"I uploaded a concise cheat-sheet for gradient-based optimization used in our labs.", likes:27, comments:9 },
  { id:3, author:{name:"Thao Tran", title:"TA - Algorithms", avatar:"https://i.pravatar.cc/80?img=5"}, time:"1h", type:"Question", course:"Algorithms", content:"Any clean proof sketch for Dijkstra correctness under non-negative weights?", likes:8, comments:5 },
];

export default function CommunityPage(){
  const [posts, setPosts] = useState(seedPosts);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [course, setCourse] = useState('ALL');
  const [sort, setSort] = useState('new');

  const filtered = useMemo(() => {
    let arr = [...posts];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(p => p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || p.course.toLowerCase().includes(q));
    }
    if (type !== 'ALL') arr = arr.filter(p => p.type === type);
    if (course !== 'ALL') arr = arr.filter(p => p.course === course);
    if (sort === 'top') arr.sort((a,b)=>b.likes - a.likes); else arr.sort((a,b)=>String(b.time).localeCompare(String(a.time)));
    return arr;
  }, [posts, query, type, course, sort]);

  return (
    <div className="row g-3">
      <div className="col-lg-3 order-2 order-lg-1">
        <FiltersSidebar
          query={query} setQuery={setQuery}
          type={type} setType={setType}
          course={course} setCourse={setCourse}
          sort={sort} setSort={setSort}
        />
      </div>
      <div className="col-lg-9 order-1 order-lg-2">
        <Composer onPost={(p)=>setPosts([p, ...posts])}/>
        {filtered.map(p => <PostCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
