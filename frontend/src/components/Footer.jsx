import React from "react";
import { Link } from "react-router-dom";
import profile from "../data/profile.json";

export default function Footer() {
  const gitSha = import.meta.env.VITE_GIT_SHA || "dev-3a9b1c";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "2026-11-15 02:20 UTC";

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-meta">
            <span className="meta-badge">SHA: {gitSha.slice(0, 7)}</span>
            <span className="meta-sep">&bull;</span>
            <span className="meta-text">built: {buildTime}</span>
            <span className="meta-sep">&bull;</span>
            <span className="meta-text">Nginx 1.27 + React 19</span>
          </div>
          <p className="footer-desc">
            Production-grade personal cluster for {profile.name} &bull; {profile.location}
          </p>
        </div>

        <div className="footer-links">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
            github
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
          <Link to="/status">status</Link>
          <Link to="/pipeline">pipeline</Link>
          <Link to="/architecture">architecture</Link>
          <Link to="/chaos">chaos</Link>
        </div>
      </div>

      <style>{`
        .site-footer {
          margin-top: auto;
          border-top: 1px solid var(--line);
          background: var(--ink);
          padding: var(--space-6) 0;
          font-family: var(--font-mono);
          font-size: var(--step--1);
          color: var(--text-muted);
        }
        .footer-container {
          width: min(100% - 24px, var(--container));
          margin-inline: auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          max-width: 100%;
          box-sizing: border-box;
        }
        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .footer-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .meta-badge {
          background: rgba(124, 196, 255, 0.08);
          border: 1px solid rgba(124, 196, 255, 0.2);
          color: var(--accent);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
        }
        .meta-sep {
          color: var(--line);
        }
        .meta-text {
          font-size: 0.8rem;
        }
        .footer-desc {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color var(--dur-fast) var(--ease);
        }
        .footer-links a:hover {
          color: var(--accent);
        }
      `}</style>
    </footer>
  );
}
