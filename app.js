//Bootstraps the app, loads router
// NOTE: Routing has been disabled. The router files are kept for reference.
// import { initRouter } from "./router/router.js";
import Header from "./components/header.js";
import Footer from "./components/footer.js";

// Redirect to home.html if on root or index.html
const currentPath = window.location.pathname;
const shouldRedirect = currentPath === "/" || currentPath === "/index.html" || currentPath.endsWith("/index.html");

if (shouldRedirect) {
  window.location.replace("/home.html");
} else {
  // Only initialize app if not redirecting
  const headerEl = document.getElementById("header");
  if (headerEl) headerEl.innerHTML = Header();

  const footerEl = document.getElementById("footer");
  if (footerEl) footerEl.innerHTML = Footer();
}

/* MAIN HEADER Hamburger logic */
if (!shouldRedirect) {
  document.addEventListener("click", (e) => {
    const nav = document.getElementById("header-nav");
    if (!nav) return;

    if (e.target.closest("#burger-btn")) {
      nav.classList.toggle("show");
      return;
    }

    if (e.target.closest("#close-nav")) {
      nav.classList.remove("show");
      return;
    }

    if (e.target.closest("#header-nav a")) {
      nav.classList.remove("show");
      return;
    }

    const clickedOutsideNav =
      !e.target.closest("#header-nav") && !e.target.closest("#burger-btn");

    if (nav.classList.contains("show") && clickedOutsideNav) {
      nav.classList.remove("show");
    }
  });
}

// Router initialization disabled - routing files kept for reference
// initRouter();
