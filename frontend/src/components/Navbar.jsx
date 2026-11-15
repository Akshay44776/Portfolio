import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { theme, toggleTheme, tier, toggle3D } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "terminal" },
    { to: "/projects", label: "projects" },
    { to: "/registry", label: "registry" },
    { to: "/pipeline", label: "pipeline" },
    { to: "/status", label: "status" },
    { to: "/architecture", label: "architecture" },
    { to: "/chaos", label: "chaos" },
    { to: "/resume", label: "resume" }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand">
          <span className="brand-dot" />
          <span className="brand-title">akshay.live</span>
          <span className="brand-env">prod</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions & Controls */}
        <div className="navbar-actions">
          {/* Health indicator */}
          <div className="health-indicator" title="All systems healthy, checked 12s ago" aria-label="System status healthy">
            <span className="health-dot" />
            <span className="health-label">healthy</span>
          </div>

          {/* 3D Tier Toggle */}
          <button
            type="button"
            className={`btn-control 3d-toggle ${tier === "off" ? "is-off" : "is-on"}`}
            onClick={toggle3D}
            title={`3D Mode: ${tier}. Click to toggle.`}
            aria-label={`Toggle 3D mode. Currently ${tier}`}
          >
            <span className="ctrl-tag">3d:</span>
            <span className="tier-badge">{tier}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn-control theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="mobile-nav-drawer" onClick={() => setMobileOpen(false)}>
          <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span>navigation</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="mobile-nav-links">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
                >
                  <span className="chevron">&gt;</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          height: var(--nav-height);
          background: rgba(17, 24, 33, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
          z-index: 1000;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 100vw;
        }
        :root[data-theme="light"] .navbar-header {
          background: rgba(255, 255, 255, 0.88);
        }
        .navbar-container {
          width: min(100% - 24px, var(--container));
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: var(--text);
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: var(--step--1);
          flex-shrink: 0;
        }
        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ok);
        }
        .brand-title {
          letter-spacing: -0.01em;
        }
        .brand-env {
          font-size: 0.68rem;
          padding: 1px 4px;
          border-radius: 3px;
          background: rgba(124, 196, 255, 0.12);
          color: var(--accent);
          border: 1px solid rgba(124, 196, 255, 0.25);
          text-transform: uppercase;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link {
          position: relative;
          color: var(--text-muted);
          text-decoration: none;
          padding: 6px 10px;
          font-size: 0.82rem;
          font-family: var(--font-mono);
          border-radius: var(--radius-sm);
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.04);
        }
        .nav-link.active {
          color: var(--text);
          font-weight: 500;
        }
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -9px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .health-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 6px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          cursor: default;
        }
        .health-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ok);
        }
        .btn-control {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          min-height: 28px;
          padding: 0 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line);
          background: var(--panel);
          color: var(--text);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          transition: border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
        }
        .btn-control:hover {
          border-color: var(--text-muted);
        }
        .tier-badge {
          padding: 1px 3px;
          border-radius: 3px;
          background: rgba(124, 196, 255, 0.15);
          color: var(--accent);
          font-weight: 600;
        }
        .is-off .tier-badge {
          background: rgba(140, 155, 176, 0.15);
          color: var(--text-muted);
        }
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: transparent;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          color: var(--text);
          cursor: pointer;
        }
        .mobile-nav-drawer {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }
        .mobile-nav-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--panel-raised);
          border-top: 1px solid var(--line);
          border-radius: 16px 16px 0 0;
          padding: 16px 20px 32px;
          animation: slideUp 200ms var(--ease);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: var(--step--1);
          color: var(--text-muted);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--line);
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          color: var(--text);
          text-decoration: none;
          font-family: var(--font-mono);
          font-size: var(--step-0);
          border: 1px solid transparent;
        }
        .mobile-nav-link.active {
          background: rgba(124, 196, 255, 0.08);
          border-color: rgba(124, 196, 255, 0.2);
          color: var(--accent);
        }
        .mobile-nav-link .chevron {
          color: var(--accent);
          font-size: 0.85rem;
        }

        @media (max-width: 1080px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
        }
        @media (max-width: 500px) {
          .health-indicator .health-label { display: none; }
          .ctrl-tag { display: none; }
        }
        @media (max-width: 380px) {
          .brand-env { display: none; }
          .health-indicator { display: none; }
        }
      `}</style>
    </header>
  );
}
