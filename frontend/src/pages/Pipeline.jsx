import React, { useState, useEffect } from "react";
import pipelineData from "../data/pipeline.mock.json";
import SceneCanvas from "../three/SceneCanvas";
import PipelineConveyorScene, { GATES } from "../three/scenes/PipelineConveyorScene";
import ClusterFallback from "../components/ClusterFallback";
import { REPO, repoConfigured, fetchRuns, fetchRunStages } from "../lib/githubActions";

export default function Pipeline() {
  const sampleRuns = [
    ...(pipelineData.runs || []),
    {
      id: 2,
      workflow: "ci",
      branch: "main",
      commit: "f4b98e1",
      conclusion: "success",
      durationSec: 68,
      stages: [
        { name: "lint", status: "success" },
        { name: "build", status: "success" },
        { name: "scan", status: "success" },
        { name: "deploy", status: "success" }
      ]
    },
    {
      id: 3,
      workflow: "ci",
      branch: "feat/chaos-sandbox",
      commit: "e2c7a03",
      conclusion: "success",
      durationSec: 81,
      stages: [
        { name: "lint", status: "success" },
        { name: "build", status: "success" },
        { name: "scan", status: "success" },
        { name: "deploy", status: "success" }
      ]
    }
  ];

  // "loading" | "live" | "sample"
  const [source, setSource] = useState(repoConfigured ? "loading" : "sample");
  const [runs, setRuns] = useState(repoConfigured ? [] : sampleRuns);
  const [selectedRun, setSelectedRun] = useState(repoConfigured ? null : sampleRuns[0]);
  const [errorMsg, setErrorMsg] = useState("");

  // Load real workflow runs from GitHub Actions; fall back to sample data on any failure.
  useEffect(() => {
    if (!repoConfigured) return;
    const ctrl = new AbortController();
    fetchRuns(ctrl.signal)
      .then((live) => {
        if (live.length === 0) throw new Error("No workflow runs found yet");
        setRuns(live);
        setSelectedRun(live[0]);
        setSource("live");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setErrorMsg(err.message);
        setRuns(sampleRuns);
        setSelectedRun(sampleRuns[0]);
        setSource("sample");
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the step list (lint/build/...) for the selected live run on demand.
  useEffect(() => {
    if (source !== "live" || !selectedRun || selectedRun.stages) return;
    const ctrl = new AbortController();
    fetchRunStages(selectedRun.id, ctrl.signal)
      .then((stages) => {
        setRuns((prev) => prev.map((r) => (r.id === selectedRun.id ? { ...r, stages } : r)));
        setSelectedRun((cur) => (cur && cur.id === selectedRun.id ? { ...cur, stages } : cur));
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setRuns((prev) => prev.map((r) => (r.id === selectedRun.id ? { ...r, stages: [] } : r)));
        setSelectedRun((cur) => (cur && cur.id === selectedRun.id ? { ...cur, stages: [] } : cur));
      });
    return () => ctrl.abort();
  }, [source, selectedRun]);

  const latest = runs[0];
  const badgeClass =
    source === "loading" ? "pending" : latest?.conclusion === "success" ? "ok" : latest?.conclusion === "failure" ? "fail" : "warn";
  const badgeText =
    source === "loading"
      ? "loading runs..."
      : source === "sample"
      ? "sample data"
      : latest?.conclusion === "success"
      ? "latest run passing"
      : `latest run: ${latest?.conclusion}`;
  const badgeStatus = (c) => (c === "success" ? "ok" : c === "failure" ? "fail" : "warn");

  return (
    <div className="pipeline-page">
      <div className="container">
        {/* Header */}
        <div className="pipeline-header">
          <div className="header-meta">
            <span className="section-eyebrow">continuous integration & delivery</span>
            <span className={`badge badge--${badgeClass}`}>{badgeText}</span>
          </div>
          <h1 className="pipeline-title">CI/CD Pipeline</h1>
          <p className="pipeline-desc">
            Automated quality assurance, security scanners, Docker containerization, and immutable image publishing.
          </p>
        </div>

        {/* 3D Conveyor Scene */}
        <div className="panel pipeline-conveyor-panel">
          <div className="conveyor-header">
            <span className="conveyor-title">assembly conveyor &bull; gate traversal</span>
            <span className="conveyor-sub">Build capsule travelling through verified gates</span>
          </div>
          <div className="conveyor-canvas-box">
            <SceneCanvas
              fallback={<ClusterFallback title="CI Pipeline Conveyor" />}
              className="conveyor-scene-canvas"
            >
              <PipelineConveyorScene />
            </SceneCanvas>
          </div>
          <div className="gate-legend">
            {GATES.map((g, i) => (
              <div key={g.name} className="gate-legend-item">
                <span className="gate-legend-name font-mono">
                  {i + 1}. stage: [{g.name}]{g.planned ? " (planned)" : ""}
                </span>
                <span className="gate-legend-desc">{g.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Run Summary Strip */}
        {selectedRun && (
          <div className="panel latest-run-strip">
            <div className="run-strip-top">
              <div className="strip-info">
                <span className={`badge badge--${badgeStatus(selectedRun.conclusion)}`}>run #{selectedRun.number ?? selectedRun.id}</span>
                <span className="strip-workflow font-mono">{selectedRun.workflow}.yml</span>
                <span className="meta-sep">&bull;</span>
                <span className="strip-branch font-mono">{selectedRun.branch}</span>
                <span className="meta-sep">&bull;</span>
                <span className="strip-commit font-mono">commit {selectedRun.commit}</span>
              </div>
              <div className="strip-duration font-mono">
                duration: {selectedRun.durationSec != null ? `${selectedRun.durationSec}s` : "in progress"}
                {selectedRun.url && (
                  <>
                    {" "}&bull;{" "}
                    <a href={selectedRun.url} target="_blank" rel="noopener noreferrer">
                      view on GitHub &#x2197;
                    </a>
                  </>
                )}
              </div>
            </div>
            {selectedRun.message && (
              <div className="strip-message font-mono">&quot;{selectedRun.message}&quot;</div>
            )}

            {/* Stages Chips Track */}
            <div className="run-stages-track">
              {selectedRun.stages == null && (
                <span className="font-mono strip-duration">loading steps...</span>
              )}
              {selectedRun.stages && selectedRun.stages.length === 0 && (
                <span className="font-mono strip-duration">no step data available for this run</span>
              )}
              {(selectedRun.stages || []).map((stage, idx) => (
                <React.Fragment key={stage.name}>
                  <div className={`stage-chip stage--${stage.status}`}>
                    <span className="stage-dot" />
                    <span className="stage-name font-mono">{stage.name}</span>
                    <span className="stage-status font-mono">({stage.status})</span>
                  </div>
                  {idx < selectedRun.stages.length - 1 && <div className="stage-connector" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Historical Pipeline Runs */}
        <div className="panel runs-history-card">
          <div className="history-header">
            <h2 className="history-title">Recent Workflow Runs</h2>
            <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {source === "live" ? `repo: ${REPO}` : source === "loading" ? "fetching from GitHub..." : "sample data (not live)"}
            </span>
          </div>
          {errorMsg && source === "sample" && (
            <p className="font-mono" style={{ fontSize: "0.78rem", color: "var(--warn)", margin: "0 0 12px" }}>
              Could not load live runs: {errorMsg}
            </p>
          )}

          <div className="table-responsive">
            <table className="runs-table">
              <thead>
                <tr>
                  <th>run</th>
                  <th>workflow</th>
                  <th>commit</th>
                  <th>duration</th>
                  <th>status</th>
                  <th style={{ textAlign: "right" }}>action</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className={`run-row ${selectedRun?.id === run.id ? "active-row" : ""}`}
                    onClick={() => setSelectedRun(run)}
                  >
                    <td className="font-mono">#{run.number ?? run.id}</td>
                    <td className="font-mono" style={{ color: "var(--accent)" }}>{run.workflow}</td>
                    <td className="font-mono">{run.commit}</td>
                    <td className="font-mono">{run.durationSec != null ? `${run.durationSec}s` : "-"}</td>
                    <td>
                      <span className={`badge badge--${badgeStatus(run.conclusion)}`}>
                        {run.conclusion}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRun(run);
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .pipeline-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .pipeline-header {
          margin-bottom: var(--space-6);
        }
        .pipeline-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .pipeline-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* 3D Conveyor */
        .pipeline-conveyor-panel {
          margin-bottom: var(--space-6);
          overflow: hidden;
          padding: 0;
        }
        .conveyor-header {
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
        .conveyor-canvas-box {
          height: 320px;
          position: relative;
          background: var(--ink);
        }
        .conveyor-scene-canvas {
          width: 100%;
          height: 100%;
        }
        .gate-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 1px;
          background: var(--line);
          border-top: 1px solid var(--line);
        }
        .gate-legend-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 16px;
          background: var(--panel);
        }
        .gate-legend-name {
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .gate-legend-desc {
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        /* Run Strip */
        .latest-run-strip {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .run-strip-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .strip-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }
        .strip-workflow {
          color: var(--accent);
        }
        .strip-commit {
          color: var(--text-muted);
        }
        .strip-duration {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .run-stages-track {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 8px 0;
        }
        .stage-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line);
          background: var(--panel-raised);
          font-size: 0.8rem;
        }
        .stage-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .stage--success .stage-dot { background: var(--ok); }
        .stage--success { border-color: rgba(52, 211, 161, 0.3); }
        .stage--failure .stage-dot { background: var(--fail); }
        .stage--failure { border-color: rgba(255, 107, 122, 0.4); }
        .stage--in_progress .stage-dot, .stage--queued .stage-dot { background: var(--warn); }
        .stage--skipped .stage-dot, .stage--cancelled .stage-dot { background: var(--text-muted); }
        .strip-message { font-size: 0.8rem; color: var(--text-muted); }
        .stage-connector {
          width: 24px;
          height: 2px;
          background: var(--line);
        }

        /* History Table */
        .runs-history-card {
          padding: var(--space-5);
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        .history-title {
          font-size: var(--step-2);
          margin: 0;
        }
        .runs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
          text-align: left;
        }
        .runs-table th {
          padding: 10px 14px;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--line);
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .runs-table td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        .run-row {
          cursor: pointer;
          transition: background var(--dur-fast) var(--ease);
        }
        .run-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .active-row {
          background: rgba(124, 196, 255, 0.06);
        }
      `}</style>
    </div>
  );
}
