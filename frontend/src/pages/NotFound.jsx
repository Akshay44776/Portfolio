import React from "react";
import { Link } from "react-router-dom";
import SceneCanvas from "../three/SceneCanvas";
import LostNodeScene from "../three/scenes/LostNodeScene";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-canvas-container">
        <SceneCanvas
          className="not-found-canvas"
          fallback={
            <div className="lost-node-fallback">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" stroke="#FF6B7A" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                <rect x="42" y="42" width="16" height="16" rx="3" fill="#253246" stroke="#FF6B7A" strokeWidth="1.5" />
              </svg>
            </div>
          }
        >
          <LostNodeScene />
        </SceneCanvas>
      </div>

      <div className="container not-found-content">
        <div className="panel not-found-card">
          <div className="not-found-status">
            <span className="badge badge--fail">status 404</span>
            <span className="not-found-code">ERR_INGRESS_ROUTE_NOT_FOUND</span>
          </div>

          <h1 className="not-found-title">Route out of bounds</h1>
          <p className="not-found-text">
            The requested URI does not match any deployed service, container or artifact in this cluster.
          </p>

          <div className="not-found-terminal-box">
            <code>
              $ curl -I https://akshay.live{typeof window !== "undefined" ? window.location.pathname : "/unknown"}
              <br />
              HTTP/2 404 Not Found
              <br />
              x-cluster-node: orphaned-pod-0x9a
              <br />
              diagnosis: path not recognized by reverse proxy
            </code>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn btn--primary">
              Return to terminal
            </Link>
            <Link to="/projects" className="btn">
              View active services
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .not-found-page {
          min-height: calc(100vh - var(--nav-height) - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: var(--space-7) 0;
        }
        .not-found-canvas-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .not-found-canvas {
          width: 100%;
          height: 100%;
        }
        .lost-node-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          opacity: 0.5;
        }
        .not-found-content {
          position: relative;
          z-index: 2;
          max-width: 620px;
        }
        .not-found-card {
          padding: var(--space-6);
        }
        .not-found-status {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: var(--space-4);
          font-family: var(--font-mono);
          font-size: var(--step--1);
        }
        .not-found-code {
          color: var(--text-muted);
        }
        .not-found-title {
          font-size: var(--step-3);
          margin-bottom: var(--space-3);
        }
        .not-found-text {
          color: var(--text-muted);
          margin-bottom: var(--space-5);
        }
        .not-found-terminal-box {
          background: rgba(10, 14, 20, 0.7);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          margin-bottom: var(--space-5);
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .not-found-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
