// data/server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Students.json only
const studentsFile = path.join(__dirname, "Students.json");

// Load JSON safely
function loadJson(file) {
  try {
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading JSON:", err.message);
    return [];
  }
}

// Load students correctly regardless of JSON shape
const rawStudents = loadJson(studentsFile);

let students = Array.isArray(rawStudents.users)
  ? rawStudents.users
  : Array.isArray(rawStudents.data)
    ? rawStudents.data
    : Array.isArray(rawStudents)
      ? rawStudents
      : [];

// Debug
if (students.length === 0) {
  console.warn("No students loaded");
}

// Normalize student format for the API
function mapStudent(s) {
  return {
    id: s.id ?? s.studentId ?? "",
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    year: s.year ?? s.class ?? "",
    dob: s.dob ?? s.DOB ?? s.dateOfBirth ?? "",
    role: "student",
  };
}

// GET all students
app.get("/api/users", (req, res) => {
  try {
    const mapped = students.map(mapStudent);
    res.json({ users: mapped });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// GET single student
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const student = students.find((s) => String(s.id ?? s.studentId) === id);

  if (student) {
    res.json({ ok: true, user: mapStudent(student) });
  } else {
    res.status(404).json({ ok: false, msg: "User not found" });
  }
});

// ADD student
app.post("/api/users", (req, res) => {
  try {
    const newStudent = req.body;
    newStudent.id = newStudent.id || `std-${Date.now()}`; // Ensure ID
    students.push(newStudent);
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    res.status(201).json({ ok: true, user: newStudent });
  } catch (err) {
    console.error("Error adding user:", err.message);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// UPDATE student
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const index = students.findIndex((s) => String(s.id ?? s.studentId) === id);

  if (index === -1) {
    return res.status(404).json({ ok: false, msg: "User not found" });
  }

  students[index] = { ...students[index], ...updatedData };
  fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));

  res.json({ ok: true, user: students[index] });
});

// DELETE student
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  const index = students.findIndex((s) => String(s.id ?? s.studentId) === id);

  if (index === -1) {
    return res.status(404).json({ ok: false, msg: "User not found" });
  }

  students.splice(index, 1);

  try {
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    res.json({ ok: true, deleted: id });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ ok: false, msg: "Failed to write to file" });
  }
});

// Serve static site
app.use(express.static(path.join(__dirname, "..")));

const PORT = 3001;
app.listen(PORT, () => {
  // Server started successfully
});
