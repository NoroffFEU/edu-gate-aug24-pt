export default function Header() {
  return `
    <header class="main-header">
      <div class="header-container">
        <a href="/" class="logo" aria-label="Home">
          <img src="/public/img/logo.png" alt="EduGate" />
        </a>

        <button id="burger-btn" class="burger-btn"
                aria-label="Open menu"
                aria-controls="header-nav"
                aria-expanded="false">☰</button>

        <nav id="header-nav" class="header-nav" role="navigation" aria-hidden="true">
          <button id="close-nav" class="close-nav" aria-label="Close menu">✕</button>

          <a href="/pages/about.html">
            <span>About</span>
            <img src="/public/icons/about.png" class="nav-icon" alt="About icon" />
          </a>

          <a href="/pages/contact.html">
            <span>Contact</span>
            <img src="/public/icons/contact.png" class="nav-icon" alt="Contact icon" />
          </a>
        </nav>
      </div>
    </header>
  `;
}
