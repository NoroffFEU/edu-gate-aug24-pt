/* TEACHER SIDEBAR (Desktop + Mobile)Works with: class="teacher-dashboard-page" */

const isDashboard = document.body.classList.contains("teacher-dashboard-page");

/* DESKTOP SIDEBAR — AUTO INSERT */
const sidebarRoot = document.getElementById("teacher-sidebar");

if (isDashboard && sidebarRoot) {
  sidebarRoot.innerHTML = `
    <aside class="teacher-desktop-sidebar">
      <nav>
        <a href="./teacher-dashboard.html">
          <img src="../public/icons/dashboard.png">
          <span>Dashboard</span>
        </a>

        <a href="./select-student.html">
          <img src="../public/icons/results.png">
          <span>Manage Results</span>
        </a>

         <a href="../pages/user-management.html">
          <img src="../public/icons/user-management.png">
          <span>Student Management</span>
        </a>


        <a href="./top-students.html">
          <img src="../public/icons/top-students.png">
          <span>Top Students</span>
        </a>

        <a href="./login.html" class="logout">
          <img src="../public/icons/logout.png">
          <span>Logout</span>
        </a>
      </nav>
    </aside>
  `;
}

/*  MOBILE NAV — AUTO INSERT */

const mobileRoot = document.getElementById("teacher-mobile-nav");

if (mobileRoot) {
  mobileRoot.innerHTML = `
    <div class="teacher-mobile-header">
      <img class="teacher-mobile-logo" src="../public/img/logo.png" alt="EduGate">
      <button id="teacher-mobile-toggle">☰</button>
    </div>

    <div class="teacher-mobile-sidebar">
      <button id="teacher-mobile-close">✕</button>

      <nav class="teacher-mobile-links">
        <a href="./teacher-dashboard.html">Dashboard <img src="../public/icons/dashboard.png"></a>
        <a href="./profile.html">Profile <img src="../public/icons/user-circle.png"></a>
        <a href="./select-student.html">Manage Results <img src="../public/icons/results.png"></a>
        <a href="../pages/user-management.html">Student Management <img src="../public/icons/user-management.png"></a>
        <a href="./about.html">About <img src="../public/icons/about.png"></a>
        <a href="./contact.html">Contact <img src="../public/icons/contact.png"></a>

        <a href="./login.html" class="logout">Logout <img src="../public/icons/logout.png"></a>
      </nav>
    </div>

    <div class="teacher-mobile-overlay"></div>
  `;
}

/* MOBILE MENU LOGIC*/

const mobileToggle = document.getElementById("teacher-mobile-toggle");
const mobileSidebar = document.querySelector(".teacher-mobile-sidebar");
const mobileOverlay = document.querySelector(".teacher-mobile-overlay");
const mobileClose = document.getElementById("teacher-mobile-close");

function openMenu() {
  if (!mobileSidebar || !mobileOverlay) return;
  mobileSidebar.classList.add("open");
  mobileOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!mobileSidebar || !mobileOverlay) return;
  mobileSidebar.classList.remove("open");
  mobileOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

if (mobileToggle) mobileToggle.addEventListener("click", openMenu);
if (mobileClose) mobileClose.addEventListener("click", closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

/* RESPONSIVE LOGIC — Hide desktop sidebar & main header on mobile*/

const mainHeader = document.getElementById("header");
const desktopSidebar = document.querySelector(".teacher-desktop-sidebar");

function updateLayout() {
  const isMobile = window.innerWidth <= 900;

  if (isMobile) {
    if (mainHeader) mainHeader.style.display = "none";
    if (desktopSidebar) desktopSidebar.style.display = "none";
  } else {
    if (mainHeader) mainHeader.style.display = "block";
    if (desktopSidebar) desktopSidebar.style.display = "block";
  }
}

updateLayout();
window.addEventListener("resize", updateLayout);
