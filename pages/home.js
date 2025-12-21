export default function Home() {
  return /*HTML*/ `
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="hero-title">Edugate</h1>
        <p class="hero-subtitle">
          Welcome to Edugate, the platform that lets you access your exam results online.
        </p>
      </div>
    </section>

    <section class="hero-cta">
      <div class="hero-buttons">
        <a href="/pages/signup.html" class="btn btn-primary">Sign Up</a>
        <a href="/pages/login.html" class="btn btn-secondary">Log In</a>
      </div>
    </section>
  `;
}
