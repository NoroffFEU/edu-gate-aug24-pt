// Students page component - displays list of students from database
export default function Students() {
  // Use requestAnimationFrame to ensure DOM is rendered before fetching data
  requestAnimationFrame(() => {
    loadStudents();
  });

  return /*HTML*/ `
    <div class="students-container">
      <h1>Students</h1>
      <div id="students-list" class="students-list">
        <p>Loading students...</p>
      </div>
    </div>
  `;
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function loadStudents() {
  const studentsContainer = document.getElementById("students-list");
  if (!studentsContainer) return;

  try {
    const response = await fetch("/data/Students.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const students = data.users || [];

    if (students.length === 0) {
      studentsContainer.innerHTML = "<p>No students found.</p>";
      return;
    }

    studentsContainer.innerHTML = `
      <table class="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          ${students
            .map(
              (student) => `
            <tr>
              <td>${escapeHtml(student.id)}</td>
              <td>${escapeHtml(student.firstName)}</td>
              <td>${escapeHtml(student.lastName)}</td>
              <td>${escapeHtml(student.gender)}</td>
              <td>${escapeHtml(student.class)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Error loading students:", error);
    studentsContainer.innerHTML =
      "<p>Error loading students. Please try again later.</p>";
  }
}
