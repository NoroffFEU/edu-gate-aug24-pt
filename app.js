//Bootstraps the app, loads router
import { initRouter } from "./router/router.js";
import Header from "./components/header.js";
import Footer from "./components/footer.js";

const headerEl = document.getElementById("header");
if (headerEl) headerEl.innerHTML = Header();

const footerEl = document.getElementById("footer");
if (footerEl) footerEl.innerHTML = Footer();

/* MAIN HEADER Hamburger logic */

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

initRouter();
