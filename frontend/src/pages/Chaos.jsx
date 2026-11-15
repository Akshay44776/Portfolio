import React, { useState } from "react";
import SceneCanvas from "../three/SceneCanvas";
import ChaosGlitchScene from "../three/scenes/ChaosGlitchScene";
import ClusterFallback from "../components/ClusterFallback";
import { useApp } from "../context/AppContext";

export default function Chaos() {
  const { chaosState, setChaosState, showToast } = useApp();
  const [timeline, setTimeline] = useState([
    {
      time: "00:00:00.000",
      type: "info",
      message: "Chaos sandbox ready. Target: sandbox-pod-0x4f. Automated watchdog standing by."
    }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const triggerChaosEvent = () => {
    if (isRunning) return;
    setIsRunning(true);
    setChaosState("glitch");
    showToast("Chaos injected into sandbox pod [SIGKILL]");

    const now = () => new Date().toISOString().substring(11, 23);

    // Sequence: Fault -> Alert -> Recovering -> Healed
    setTimeline((prev) => [
      {
        time: now(),
        type: "fail",
        message: "[FAULT_INJECTION] Synthetic SIGKILL delivered to sandbox-pod-0x4f. Container terminating abnormally."
      },
      ...prev
    ]);

    setTimeout(() => {
      setChaosState("alert");
      setTimeline((prev) => [
        {
          time: now(),
          type: "warn",
          message: "[ALERT_TRIGGERED] Prometheus blackbox probe failed: HTTP 503 Service Unavailable. P1 alert fired."
        },
        ...prev
      ]);
    }, 1400);

    setTimeout(() => {
      setChaosState("recovering");
      setTimeline((prev) => [
        {
          time: now(),
          type: "info",
          message: "[SELF_HEALING] Kubernetes kubelet restart policy / Docker restart: container spawned on healthy worker."
        },
        ...prev
      ]);
    }, 2800);

    setTimeout(() => {
      setChaosState("normal");
      setIsRunning(false);
      setTimeline((prev) => [
        {
          time: now(),
          type: "ok",
          message: "[RECOVERY_COMPLETE] Health check /healthz returning 200 OK. Sandbox cluster restored to 100% capacity."
        },
        ...prev
      ]);
      showToast("Sandbox pod healed and rejoined cluster");
    }, 4400);
  };

  return (
    <div className="chaos-page">
      <div className="container">
        {/* Header */}
        <div className="chaos-header">
          <div className="header-meta">
            <span className="section-eyebrow">resilience engineering</span>
            <span className="badge badge--warn">safe simulated sandbox</span>
          </div>
          <h1 className="chaos-title">Chaos Engineering Lab</h1>
          <p className="chaos-desc">
            Test the resilience, automated alert propagation, and container restart policies by injecting synthetic faults into an isolated sandbox node.
          </p>
        </div>

        {/* 3D Break & Heal Scene */}
        <div className="panel chaos-canvas-panel">
          <div className="chaos-canvas-header">
            <span className="chaos-title-tag">break & heal simulation &bull; sandbox cluster node</span>
            <span className="badge badge--warn" style={{ fontSize: "0.72rem" }}>
              state: {chaosState}
            </span>
          </div>
          <div className="chaos-canvas-box">
            <SceneCanvas
              fallback={<ClusterFallback title="Chaos Laboratory" />}
              className="chaos-scene-canvas"
              isChaosActive={chaosState === "glitch" || chaosState === "alert"}
            >
              <ChaosGlitchScene />
            </SceneCanvas>
          </div>
          <div className="chaos-legend font-mono">
            <span className="chaos-legend-item"><span className="cl-dot cl-dot--ok" />node-a &bull; healthy replica</span>
            <span className="chaos-legend-item">
              <span className={`cl-dot cl-dot--${chaosState}`} />
              sandbox-pod-0x4f &bull; fault target ({chaosState})
            </span>
            <span className="chaos-legend-item"><span className="cl-dot cl-dot--accent" />node-b &bull; healthy replica</span>
          </div>
        </div>

        {/* Control Box & Sandbox Notice */}
        <div className="panel chaos-control-panel">
          <div className="sandbox-notice-box">
            <span className="notice-icon">&#x26A0;</span>
            <div>
              <div className="notice-heading">Isolated Sandbox Boundary Notice</div>
              <p className="notice-text">
                Injecting chaos here targets an isolated mock container state (<code className="font-mono">sandbox-pod-0x4f</code>).
                The actual production website and reverse proxy are completely unaffected.
              </p>
            </div>
          </div>

          <div className="control-action-row">
            <button
              type="button"
              className={`btn btn--primary btn-chaos-trigger ${isRunning ? "btn-running" : ""}`}
              onClick={triggerChaosEvent}
              disabled={isRunning}
            >
              {isRunning ? "Chaos Event In Progress..." : "Inject Chaos (Kill Sandbox Pod)"}
            </button>
            <span className="font-mono current-state-label">
              current pod status: <span className={`state--${chaosState}`}>{chaosState.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Live Event Timeline */}
        <div className="panel timeline-panel">
          <div className="timeline-header">
            <h2 className="timeline-title">Live Telemetry & Recovery Event Log</h2>
            <button
              type="button"
              className="btn btn--sm font-mono"
              onClick={() =>
                setTimeline([
                  {
                    time: "00:00:00.000",
                    type: "info",
                    message: "Log cleared. Automated watchdog standing by."
                  }
                ])
              }
            >
              Clear Log
            </button>
          </div>

          <div className="chaos-log-list font-mono">
            {timeline.map((entry, idx) => (
              <div key={idx} className={`log-entry log--${entry.type}`}>
                <span className="log-time">{entry.time}</span>
                <span className="log-msg">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .chaos-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .chaos-header {
          margin-bottom: var(--space-6);
        }
        .chaos-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .chaos-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* 3D Scene */
        .chaos-canvas-panel {
          margin-bottom: var(--space-6);
          overflow: hidden;
          padding: 0;
        }
        .chaos-canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--line);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .chaos-canvas-box {
          height: 320px;
          position: relative;
          background: var(--ink);
        }
        .chaos-scene-canvas {
          width: 100%;
          height: 100%;
        }
        .chaos-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 20px;
          padding: 10px 16px;
          border-top: 1px solid var(--line);
          background: var(--panel);
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .chaos-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .cl-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ok);
        }
        .cl-dot--accent { background: var(--accent); }
        .cl-dot--normal { background: var(--ok); }
        .cl-dot--glitch { background: var(--fail); }
        .cl-dot--alert { background: var(--warn); }
        .cl-dot--recovering { background: var(--accent); }

        /* Control Panel */
        .chaos-control-panel {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .sandbox-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: rgba(245, 181, 68, 0.08);
          border: 1px solid rgba(245, 181, 68, 0.25);
          border-radius: var(--radius-sm);
          padding: 14px;
        }
        .notice-icon {
          color: var(--warn);
          font-size: 1.4rem;
        }
        .notice-heading {
          font-weight: 600;
          color: var(--warn);
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .notice-text {
          color: var(--text);
          font-size: 0.88rem;
          margin: 0;
        }
        .control-action-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .btn-chaos-trigger {
          min-height: 48px;
          padding: 0 24px;
          font-size: 1rem;
        }
        .btn-running {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .current-state-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .state--normal { color: var(--ok); }
        .state--glitch { color: var(--fail); }
        .state--alert { color: var(--warn); }
        .state--recovering { color: var(--accent); }

        /* Timeline Log */
        .timeline-panel {
          padding: var(--space-5);
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        .timeline-title {
          font-size: var(--step-2);
          margin: 0;
        }
        .chaos-log-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--ink);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 14px;
          max-height: 320px;
          overflow-y: auto;
          font-size: 0.82rem;
        }
        .log-entry {
          display: flex;
          gap: 12px;
          line-height: 1.5;
        }
        .log-time {
          color: var(--text-muted);
          white-space: nowrap;
        }
        .log--fail { color: var(--fail); }
        .log--warn { color: var(--warn); }
        .log--ok { color: var(--ok); }
        .log--info { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
