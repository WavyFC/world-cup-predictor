// src/components/Navbar.jsx

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* Top dark navbar */}
      <header className="top-navbar">
        <div className="top-navbar__left">
          <div className="brand-mark">26</div>
          <div className="brand-text">
            <span className="brand-title">World Cup Predictor</span>
            <span className="brand-subtitle">2026 Edition</span>
          </div>
        </div>

        <nav className="top-navbar__links">
          <NavLink to="/" className="top-nav-link">
            Group Stage
          </NavLink>

          <NavLink to="/knockout" className="top-nav-link">
            Knockout
          </NavLink>

          <NavLink to="/summary" className="top-nav-link">
            Summary
          </NavLink>
          <NavLink to="/leaderboard" className="top-nav-link">
          <NavLink to="/pools" className="top-nav-link">
  Pools
</NavLink>
  Leaderboard
</NavLink>
        </nav>
      </header>

      {/* Colorful tournament banner */}
      <section className="tournament-banner">
        <div className="banner-overlay" />

        <div className="tournament-banner__content">
          <div>
            <p className="banner-kicker">FIFA World Cup 2026 Inspired Theme</p>
            <h1 className="banner-title">Build your tournament. Predict every round.</h1>
            <p className="banner-subtitle">
              Enter group scores, generate the bracket, and crown your champion.
            </p>
          </div>

          <div className="banner-badge">
            <span className="banner-badge__big">26</span>
            <span className="banner-badge__small">World Cup</span>
          </div>
        </div>
      </section>
    </>
  );
}