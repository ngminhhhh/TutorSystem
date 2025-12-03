// server/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;

const DB_FILE = path.join(__dirname, "users.json");
const WS_FILE = path.join(__dirname, "workspaces.json");
const REQ_FILE = path.join(__dirname, "matchingRequests.json");

app.use(cors());
app.use(express.json());

/* ========== COMMON HELPERS ========== */

function safeReadJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, "utf8") || "[]";
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${file}, reset to fallback`, e);
    return fallback;
  }
}

function safeWriteJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function makeAvatar(username) {
  return `https://i.pravatar.cc/80?u=${encodeURIComponent(username)}`;
}

/* ========== USERS DB ========== */

function ensureUsersDb() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = [
      {
        id: "u_student",
        username: "student",
        password: "123456",
        name: "Nguyễn Công Minh",
        role: "student",
        email: "student@hcmut.edu.vn",
        studentId: "20123xxx",
        major: "Computer Science",
        year: "3",
        location: "TP.HCM",
        skills: ["Python", "Machine Learning"],
        avatar: "https://i.pravatar.cc/160?img=2",
        about:
          "Mình là sinh viên năm 3 CS, quan tâm đến ML/Autostore & ITS.\nThích đồ án thực chiến, code sạch, và tối ưu hiệu năng.",
        bio: "Sinh viên Khoa học máy tính năm 3, thích ML và game theory.",
        phone: ""
      },
      {
        id: "u_teacher",
        username: "teacher",
        password: "123456",
        name: "Teacher User",
        role: "tutor",
        email: "teacher@hcmut.edu.vn",
        studentId: "",
        major: "Machine Learning",
        year: "",
        location: "TP.HCM",
        skills: ["Machine Learning", "Optimization", "Deep Learning"],
        avatar: "https://i.pravatar.cc/160?img=5",
        about: "Trợ giảng thuật toán & ML, thích giải graph + DP."
      },
      {
        id: "u_admin",
        username: "admin",
        password: "admin123",
        name: "Admin User",
        role: "admin",
        email: "admin@hcmut.edu.vn",
        major: "",
        year: "",
        location: "TP.HCM",
        skills: ["System", "Management"],
        avatar: "https://i.pravatar.cc/160?img=10",
        about: "Quản trị hệ thống LMS mock."
      },
      {
        id: "u_student2",
        username: "student2",
        password: "123456",
        name: "Trần Hữu Long",
        role: "student",
        email: "student2@hcmut.edu.vn",
        studentId: "20124xxx",
        major: "Computer Science",
        year: "2",
        location: "TP.HCM",
        skills: ["C++", "Data structures"],
        avatar: "https://i.pravatar.cc/160?img=12",
        about: "Sinh viên năm 2, thích competitive programming."
      },
      {
        id: "u_student3",
        username: "student3",
        password: "123456",
        name: "Lê Thảo Nhi",
        role: "student",
        email: "student3@hcmut.edu.vn",
        studentId: "20125xxx",
        major: "Data Science",
        year: "1",
        location: "TP.HCM",
        skills: ["Python", "Statistics"],
        avatar: "https://i.pravatar.cc/160?img=15",
        about: "Tân sinh viên, quan tâm đến AI & phân tích dữ liệu."
      },
      {
        id: "u_tutor_algo",
        username: "t_algo",
        password: "123456",
        name: "Thảo Trần",
        role: "tutor",
        email: "thao.tran@hcmut.edu.vn",
        major: "Algorithms",
        year: "",
        location: "TP.HCM",
        skills: ["Algorithms", "Data Structures", "Graph"],
        avatar: "https://i.pravatar.cc/160?img=5",
        about: "Trợ giảng thuật toán, kinh nghiệm coaching đội tuyển."
      },
      {
        id: "u_tutor_ai",
        username: "t_ai",
        password: "123456",
        name: "Anh Phạm",
        role: "tutor",
        email: "anh.pham@hcmut.edu.vn",
        major: "AI Fundamentals",
        year: "",
        location: "TP.HCM",
        skills: ["AI Fundamentals", "Python", "Probability"],
        avatar: "https://i.pravatar.cc/160?img=22",
        about: "Tutor môn Nhập môn AI, thích giải thích trực quan."
      }
    ];
    safeWriteJson(DB_FILE, seed);
  }
}

function readUsers() {
  ensureUsersDb();
  return safeReadJson(DB_FILE, []);
}

function writeUsers(users) {
  safeWriteJson(DB_FILE, users);
}

/* ========== WORKSPACES DB ========== */

function ensureWsDb() {
  if (!fs.existsSync(WS_FILE)) {
    safeWriteJson(WS_FILE, []);
  }
}

function readWorkspaces() {
  ensureWsDb();
  return safeReadJson(WS_FILE, []);
}

function writeWorkspaces(list) {
  safeWriteJson(WS_FILE, list);
}

function toMember(user) {
  return {
    id: user.username,
    username: user.username,
    name: user.name,
    role: user.role,
    avatar: user.avatar || makeAvatar(user.username)
  };
}

/**
 * Đảm bảo: mỗi tutor luôn có 1 workspace riêng:
 *  id: "ws_<username>"
 *  tutor: <username>
 *  members: [ tutor member object ]
 */
function ensureTutorWorkspaces() {
  const users = readUsers();
  let workspaces = readWorkspaces();
  let changed = false;

  const tutors = users.filter(
    (u) => String(u.role || "").toLowerCase() === "tutor"
  );

  tutors.forEach((tutor) => {
    const exist = workspaces.find((w) => w.tutor === tutor.username);
    if (!exist) {
      workspaces.push({
        id: "ws_" + tutor.username,
        tutor: tutor.username,
        name: `${tutor.name} – Workspace`,
        members: [toMember(tutor)],
        createdAt: new Date().toISOString(),
        posts: [],
        files: [],
        meetings: []
      });
      changed = true;
    }
  });

  if (changed) writeWorkspaces(workspaces);
}

/* ========== MATCHING REQUESTS DB ========== */

function ensureReqDb() {
  if (!fs.existsSync(REQ_FILE)) {
    safeWriteJson(REQ_FILE, []);
  }
}

function readRequests() {
  ensureReqDb();
  return safeReadJson(REQ_FILE, []);
}

function writeRequests(list) {
  safeWriteJson(REQ_FILE, list);
}

/* ========== API: AUTH / USERS ========== */

// POST /api/login  {username, password}
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const users = readUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const { password: _, ...safe } = user;
  return res.json(safe);
});

// GET /api/users/:username
app.get("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { password: _, ...safe } = user;
  return res.json(safe);
});

// PUT /api/users/:username  (update profile)
app.put("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const patch = req.body || {};
  const users = readUsers();
  const idx = users.findIndex((u) => u.username === username);

  if (idx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const original = users[idx];
  const updated = {
    ...original,
    ...patch,
    username: original.username,
    password: original.password
  };

  users[idx] = updated;
  writeUsers(users);

  const { password: _, ...safe } = updated;
  return res.json(safe);
});

/* ========== API: TUTORS LIST ========== */

// GET /api/tutors
app.get("/api/tutors", (req, res) => {
  const users = readUsers();
  const tutors = users.filter(
    (u) => String(u.role || "").toLowerCase() === "tutor"
  );
  return res.json(tutors);
});

/* ========== API: WORKSPACES ========== */

// GET /api/workspaces?username=student
app.get("/api/workspaces", (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  ensureTutorWorkspaces();

  const all = readWorkspaces();
  const list = all.filter(
    (w) =>
      w.tutor === username ||
      (w.members || []).some(
        (m) => m.username === username || m.id === username
      )
  );

  return res.json(list);
});

/* ========== API: MATCHING REQUESTS ========== */

/**
 * GET /api/matching/requests?role=student|tutor&username=xxx&status=pending|accepted|rejected
 */
app.get("/api/matching/requests", (req, res) => {
  const { role, username, status } = req.query;
  let list = readRequests();

  if (role === "student" && username) {
    list = list.filter((r) => r.studentUsername === username);
  } else if (role === "tutor" && username) {
    list = list.filter((r) => r.tutorUsername === username);
  }

  if (status) {
    list = list.filter((r) => r.status === status);
  }

  return res.json(list);
});

/**
 * POST /api/matching/requests
 * body: { tutorUsername, studentUsername }
 * -> student gửi lời mời đến tutor
 */
app.post("/api/matching/requests", (req, res) => {
  const { tutorUsername, studentUsername } = req.body || {};
  if (!tutorUsername || !studentUsername) {
    return res
      .status(400)
      .json({ error: "Missing tutorUsername or studentUsername" });
  }

  const users = readUsers();
  const tutor = users.find((u) => u.username === tutorUsername);
  const student = users.find((u) => u.username === studentUsername);

  if (!tutor || !student) {
    return res.status(404).json({ error: "Tutor or student not found" });
  }

  let reqs = readRequests();
  const exist = reqs.find(
    (r) =>
      r.tutorUsername === tutorUsername &&
      r.studentUsername === studentUsername &&
      r.status === "pending"
  );
  if (exist) {
    return res.json(exist);
  }

  const now = new Date().toISOString();
  const reqObj = {
    id:
      "req_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8),
    tutorUsername,
    studentUsername,
    status: "pending",
    createdAt: now,
    decidedAt: null,
    tutor: {
      username: tutor.username,
      name: tutor.name,
      avatar: tutor.avatar || makeAvatar(tutor.username),
      role: tutor.role,
      major: tutor.major || ""
    },
    student: {
      username: student.username,
      name: student.name,
      avatar: student.avatar || makeAvatar(student.username),
      role: student.role
    }
  };

  reqs.unshift(reqObj);
  writeRequests(reqs);
  return res.status(201).json(reqObj);
});

/**
 * POST /api/matching/requests/:id/accept
 * -> tutor chấp nhận, student được add vào workspace của tutor
 */
app.post("/api/matching/requests/:id/accept", (req, res) => {
  const { id } = req.params;

  let reqs = readRequests();
  const idx = reqs.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Request not found" });
  }

  const reqObj = reqs[idx];
  if (reqObj.status !== "pending") {
    return res.status(400).json({ error: "Request already handled" });
  }

  const users = readUsers();
  const tutor = users.find((u) => u.username === reqObj.tutorUsername);
  const student = users.find((u) => u.username === reqObj.studentUsername);

  if (!tutor || !student) {
    return res.status(404).json({ error: "Tutor or student not found" });
  }

  // đảm bảo workspace tồn tại & add student vào
  ensureTutorWorkspaces();
  let workspaces = readWorkspaces();
  const wIdx = workspaces.findIndex((w) => w.tutor === tutor.username);
  if (wIdx === -1) {
    return res.status(500).json({ error: "Workspace for tutor not found" });
  }

  const ws = workspaces[wIdx];
  if (
    !ws.members.some(
      (m) => m.username === student.username || m.id === student.username
    )
  ) {
    ws.members.push(toMember(student));
    workspaces[wIdx] = ws;
    writeWorkspaces(workspaces);
  }

  const now = new Date().toISOString();
  const updatedReq = { ...reqObj, status: "accepted", decidedAt: now };
  reqs[idx] = updatedReq;
  writeRequests(reqs);

  return res.json({ request: updatedReq, workspace: ws });
});

/**
 * POST /api/matching/requests/:id/reject
 */
app.post("/api/matching/requests/:id/reject", (req, res) => {
  const { id } = req.params;
  let reqs = readRequests();
  const idx = reqs.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Request not found" });
  }

  const reqObj = reqs[idx];
  if (reqObj.status !== "pending") {
    return res.status(400).json({ error: "Request already handled" });
  }

  const now = new Date().toISOString();
  const updatedReq = { ...reqObj, status: "rejected", decidedAt: now };
  reqs[idx] = updatedReq;
  writeRequests(reqs);

  return res.json(updatedReq);
});

/* ========== BOOT ========== */

ensureUsersDb();
ensureTutorWorkspaces();
ensureReqDb();

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
