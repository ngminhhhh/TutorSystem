// server/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;
const DB_FILE = path.join(__dirname, "users.json");

app.use(cors());
app.use(express.json());

// Đảm bảo có file DB + seed 3 tài khoản mặc định
function ensureDb() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = [
      {
        id: "u_student",
        username: "student",
        password: "123456",
        name: "Student User",
        role: "student",
        email: "student@hcmut.edu.vn",
        studentId: "20123xxx",
        major: "Computer Science",
        year: "3",
        location: "TP.HCM",
        skills: ["Python", "Machine Learning"],
        avatar: "https://i.pravatar.cc/160?img=2",
        about:
          "Mình là sinh viên năm 3 CS, quan tâm đến ML/Autostore & ITS.\n" +
          "Thích đồ án thực chiến, code sạch, và tối ưu hiệu năng."
      },
      {
        id: "u_teacher",
        username: "teacher",
        password: "123456",
        name: "Teacher User",
        role: "tutor",
        email: "teacher@hcmut.edu.vn",
        major: "Computer Science",
        year: "",
        location: "TP.HCM",
        skills: ["Algorithms", "Data Structures"],
        avatar: "https://i.pravatar.cc/160?img=5",
        about: "Trợ giảng thuật toán, thích giải graph + DP."
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
      }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

function readUsers() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, "utf8") || "[]";
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("users.json bị hỏng, reset về []", e);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
}

// =========== API ===========

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

  // Không cho đổi username/password qua endpoint này
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

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
