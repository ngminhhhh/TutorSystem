import React from 'react';

export default function FiltersSidebar({ query, setQuery, type, setType, course, setCourse, sort, setSort }) {
  return (
    <div className="sidebar">
      <div className="filter-card mb-3">
        <div className="fw-bold mb-2"><i className="bi bi-funnel me-1"/>Filters</div>
        <input className="form-control mb-2" placeholder="Search posts…" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <label className="form-label mt-2 mb-1">Type</label>
        <select className="form-select" value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="ALL">All</option>
          <option>Announcement</option><option>Question</option><option>Share</option>
        </select>

        <label className="form-label mt-3 mb-1">Course</label>
        <select className="form-select" value={course} onChange={(e)=>setCourse(e.target.value)}>
          <option value="ALL">All</option>
          <option>AI Fundamentals</option><option>Algorithms</option><option>Machine Learning</option>
        </select>

        <label className="form-label mt-3 mb-1">Sort</label>
        <select className="form-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="top">Top (likes)</option>
        </select>
      </div>

      <div className="filter-card">
        <div className="fw-bold mb-2"><i className="bi bi-pin-angle me-1"/>Guidelines</div>
        <ul className="mb-0 small">
          <li>Be respectful & specific.</li>
          <li>Use <span className="badge badge-tag ms-1">course</span> tags.</li>
          <li>Search before posting duplicates.</li>
        </ul>
      </div>
    </div>
  );
}
