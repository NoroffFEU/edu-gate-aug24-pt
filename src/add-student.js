// src/add-student.js
const API_URL = "http://localhost:3001/api/users";

const fileInput = document.getElementById("excelInput");
const uploadBtn = document.getElementById("uploadBtn");
const backBtn = document.getElementById("backBtn");
const uploadStatus = document.getElementById("uploadStatus");

const previewBlock = document.getElementById("previewBlock");
const studentsPreview = document.getElementById("studentsPreview");
const confirmUploadBtn = document.getElementById("confirmUploadBtn");
const clearPreviewBtn = document.getElementById("clearPreviewBtn");
const sendApiCheckbox = document.getElementById("sendApi");

let lastParsed = [];

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setStatus(msg, type = "info") {
  uploadStatus.textContent = msg;
  if (type === "error") uploadStatus.style.color = "var(--accent-color)";
  else if (type === "success")
    uploadStatus.style.color = "var(--secondary-color)";
  else uploadStatus.style.color = "var(--muted)";
}

function renderPreview(rows) {
  if (!rows || rows.length === 0) {
    studentsPreview.innerHTML = "";
    previewBlock.classList.add("hidden");
    return;
  }

  // build header from common expected fields
  const headers = ["ID", "First Name", "Last Name", "Year", "DOB"];
  const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;

  const tbody = rows
    .map((r) => {
      const id = r.id ?? r.ID ?? r.id?.toString() ?? "";
      const first = r.first_name ?? r.firstName ?? r.first ?? "";
      const last = r.surname ?? r.lastName ?? r.last ?? "";
      const year = r.grad_year ?? r.class ?? r.year ?? "";
      const dob = r.dob ?? r.DOB ?? "";
      return `<tr>
      <td>${escapeHtml(id)}</td>
      <td>${escapeHtml(first)}</td>
      <td>${escapeHtml(last)}</td>
      <td>${escapeHtml(year)}</td>
      <td>${escapeHtml(dob)}</td>
    </tr>`;
    })
    .join("");

  studentsPreview.innerHTML = thead + `<tbody>${tbody}</tbody>`;
  previewBlock.classList.remove("hidden");
}

// handle upload button (parse file)
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    setStatus("Please select an Excel file (xlsx/xls).", "error");
    return;
  }

  setStatus("Reading file...");
  try {
    const data = await file.arrayBuffer();
    const workbook = window.XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows || rows.length === 0) {
      setStatus("No rows found in sheet.", "error");
      return;
    }

    // Optional: check that required keys exist in first row (flexible keys)
    const firstKeys = Object.keys(rows[0]).map((k) => k.toLowerCase());
    const required = ["first_name", "surname", "grad_year", "id", "dob"];
    const missing = required.filter(
      (r) => !firstKeys.some((k) => k.includes(r))
    );
    if (missing.length > 0) {
      // allow but warn — template may vary, show preview anyway
      setStatus(
        "Warning: Excel headers differ from template — preview shown. Required: first_name, surname, grad_year, id, dob",
        "error"
      );
    } else {
      setStatus(`${rows.length} rows parsed`, "success");
    }

    lastParsed = rows;
    renderPreview(rows);
  } catch (err) {
    console.error(err);
    setStatus("Error reading file", "error");
  }
});

// clear preview
clearPreviewBtn.addEventListener("click", () => {
  lastParsed = [];
  studentsPreview.innerHTML = "";
  previewBlock.classList.add("hidden");
  fileInput.value = "";
  setStatus("Preview cleared");
});

// confirm & save
confirmUploadBtn.addEventListener("click", async () => {
  if (!lastParsed || lastParsed.length === 0) {
    setStatus("Nothing to save", "error");
    return;
  }

  // map rows to student objects
  const students = lastParsed.map((r) => ({
    id: (r.id ?? r.ID ?? "").toString(),
    firstName: r.first_name ?? r.firstName ?? r.first ?? "",
    lastName: r.surname ?? r.lastName ?? r.last ?? "",
    year: r.grad_year ?? r.class ?? r.year ?? "",
    dob: r.dob ?? r.DOB ?? "",
    role: "student",
  }));

  if (sendApiCheckbox.checked) {
    setStatus("Sending to server...");
    let success = 0;
    for (const s of students) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s),
        });
        if (res.ok) success++;
      } catch (e) {
        console.warn("failed send", s.id, e);
      }
    }
    setStatus(
      `${success} / ${students.length} saved to server`,
      success === students.length ? "success" : "info"
    );
  } else {
    setStatus(
      `Preview only — ${students.length} rows (Send to server unchecked)`,
      "info"
    );
  }
});

// back
backBtn.addEventListener("click", () => {
  window.location.href = "./teacher-dashboard.html";
});
