import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../data/profile.json";
import projectsData from "../data/projects.json";
import registryData from "../data/registry.json";
import { useApp } from "../context/AppContext";

const COMMANDS = [
  "help",
  "about",
  "ls projects",
  "open",
  "ls certs",
  "skills",
  "contact",
  "resume",
  "clear",
  "theme",
  "chaos"
];

export default function Terminal({ onBootComplete }) {
  const navigate = useNavigate();
  const { toggleTheme, isBooting, finishBoot, setChaosState } = useApp();

  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const [bootLines, setBootLines] = useState([]);
  const [booting, setBooting] = useState(isBooting);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  // Boot sequence animation
  useEffect(() => {
    if (!booting) {
      setBootLines([
        "[INIT] Loading cluster manifest...",
        "[PULL] ghcr.io/akshay44776/portfolio:v2.4.0 verified (cosign SHA256:8f8ed1)",
        "[K8S] Spawning 4 node replicas across regional control plane...",
        "[HEALTH] Readiness probe 200 OK &bull; latency 18ms",
        "[STATUS] Cluster online. Ready for interactive session."
      ]);
      return;
    }

    const steps = [
      { text: "[INIT] Loading cluster manifest...", delay: 200 },
      { text: "[PULL] ghcr.io/akshay44776/portfolio:v2.4.0 verified (cosign SHA256:8f8ed1)", delay: 700 },
      { text: "[K8S] Spawning 4 node replicas across regional control plane...", delay: 1300 },
      { text: "[HEALTH] Readiness probe 200 OK &bull; latency 18ms", delay: 1900 },
      { text: "[STATUS] Cluster online. All services operational.", delay: 2400 }
    ];

    const timeouts = steps.map((step) =>
      setTimeout(() => {
        setBootLines((prev) => [...prev, step.text]);
      }, step.delay)
    );

    const finishTimeout = setTimeout(() => {
      setBooting(false);
      finishBoot();
      if (onBootComplete) onBootComplete();
    }, 2600);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [booting, finishBoot, onBootComplete]);

  // Auto-scroll inside terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bootLines, history]);

  const handleSkipBoot = () => {
    setBooting(false);
    finishBoot();
    setBootLines([
      "[INIT] Fast-forwarded boot sequence.",
      "[STATUS] Cluster online. Ready for interactive session."
    ]);
    if (onBootComplete) onBootComplete();
    if (inputRef.current) inputRef.current.focus();
  };

  const executeCommand = useCallback(
    (rawCmd) => {
      const trimmed = rawCmd.trim();
      if (!trimmed) {
        setHistory((prev) => [...prev, { command: "", output: null }]);
        return;
      }

      setCommandHistory((prev) => [...prev, trimmed]);
      setCmdIndex(-1);

      const parts = trimmed.split(" ").filter(Boolean);
      const mainCmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ").toLowerCase();

      let output = null;

      switch (mainCmd) {
        case "help":
          output = (
            <div className="term-help">
              <div className="term-row">
                <span className="term-cmd">help</span>
                <span className="term-desc">Display available cluster commands</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">about</span>
                <span className="term-desc">Overview of engineer profile, education & focus</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">ls projects</span>
                <span className="term-desc">List deployed services and repos</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">open &lt;slug&gt;</span>
                <span className="term-desc">Open detailed view for a service (e.g. open argus)</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">ls certs</span>
                <span className="term-desc">List verified images and credentials in registry</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">skills</span>
                <span className="term-desc">Service health status across technologies</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">contact</span>
                <span className="term-desc">Direct communications endpoints</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">resume</span>
                <span className="term-desc">Navigate to clean, printable resume</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">theme</span>
                <span className="term-desc">Toggle interface color mode (dark/light)</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">chaos</span>
                <span className="term-desc">Navigate to chaos engineering sandbox</span>
              </div>
              <div className="term-row">
                <span className="term-cmd">clear</span>
                <span className="term-desc">Purge terminal screen</span>
              </div>
            </div>
          );
          break;

        case "about":
          output = (
            <div className="term-output-block">
              <div className="term-highlight">{profile.name} &bull; {profile.title}</div>
              <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>{profile.about}</p>
              <div style={{ marginTop: "6px" }}>
                <span className="term-sub">Location:</span> {profile.location}
              </div>
              <div>
                <span className="term-sub">Education:</span> {profile.education[0]?.degree} &bull; {profile.education[0]?.institute} ({profile.education[0]?.score})
              </div>
            </div>
          );
          break;

        case "ls":
          if (arg === "projects") {
            output = (
              <div className="term-output-block">
                <div className="term-sub">ACTIVE SERVICES (4):</div>
                {projectsData.map((p) => (
                  <div key={p.slug} style={{ display: "flex", gap: "12px", margin: "2px 0" }}>
                    <span style={{ color: "var(--accent)", width: "90px" }}>{p.slug}</span>
                    <span style={{ color: "var(--text)" }}>{p.name}</span>
                    <span style={{ color: "var(--text-muted)" }}>[{p.stack.slice(0, 3).join(", ")}]</span>
                    <span className={`badge badge--${p.status === "healthy" ? "ok" : "warn"}`} style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                      {p.status}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: "6px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Tip: Type &quot;open argus&quot; or navigate to /projects
                </div>
              </div>
            );
          } else if (arg === "certs" || arg === "images") {
            output = (
              <div className="term-output-block">
                <div className="term-sub">ARTIFACT REGISTRY IMAGES:</div>
                {registryData.certificates.slice(0, 6).map((c) => (
                  <div key={c.repository} style={{ display: "flex", gap: "12px", margin: "2px 0", fontSize: "0.82rem" }}>
                    <span style={{ color: "var(--accent)" }}>{c.repository}:{c.tag}</span>
                    <span style={{ color: "var(--text-muted)" }}>{c.issued}</span>
                    <span style={{ color: c.status === "verified" ? "var(--ok)" : "var(--warn)" }}>[{c.status}]</span>
                  </div>
                ))}
                <div style={{ marginTop: "6px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Total {registryData.certificates.length} artifacts on record. Full registry at /registry
                </div>
              </div>
            );
          } else {
            output = <div className="term-error">Usage: ls projects | ls certs</div>;
          }
          break;

        case "open":
          if (!arg) {
            output = <div className="term-error">Usage: open &lt;slug&gt; (e.g. open argus, open verifarm)</div>;
          } else {
            const found = projectsData.find((p) => p.slug === arg || p.name.toLowerCase() === arg);
            if (found) {
              output = <div>Navigating to service card for {found.name}...</div>;
              setTimeout(() => navigate(`/projects#${found.slug}`), 400);
            } else {
              output = <div className="term-error">Service &quot;{arg}&quot; not found. Available: {projectsData.map((p) => p.slug).join(", ")}</div>;
            }
          }
          break;

        case "skills":
          output = (
            <div className="term-output-block">
              <div className="term-sub">SUBSYSTEM HEALTH / SKILLS:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px", marginTop: "6px" }}>
                {registryData.skills.map((s) => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "4px 8px", borderRadius: "4px" }}>
                    <span>{s.name}</span>
                    <span style={{ color: s.status === "healthy" ? "var(--ok)" : "var(--warn)" }}>
                      {s.level}% [{s.status}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
          break;

        case "contact":
          output = (
            <div className="term-output-block">
              <div><span className="term-sub">Email:</span> <a href={`mailto:${profile.email}`}>{profile.email}</a></div>
              <div><span className="term-sub">GitHub:</span> <a href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.github}</a></div>
              <div><span className="term-sub">LinkedIn:</span> <a href={profile.links.linkedin} target="_blank" rel="noreferrer">{profile.links.linkedin}</a></div>
            </div>
          );
          break;

        case "resume":
          output = <div>Navigating to resume...</div>;
          setTimeout(() => navigate("/resume"), 300);
          break;

        case "theme":
          toggleTheme();
          output = <div>Theme toggled.</div>;
          break;

        case "chaos":
          output = <div>Opening chaos experiment laboratory...</div>;
          setTimeout(() => navigate("/chaos"), 300);
          break;

        case "clear":
          setHistory([]);
          return;

        default:
          output = (
            <div className="term-error">
              Command not recognized: &quot;{trimmed}&quot;. Type <span style={{ color: "var(--accent)" }}>help</span> for available commands.
            </div>
          );
      }

      setHistory((prev) => [...prev, { command: trimmed, output }]);
    },
    [navigate, toggleTheme]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = cmdIndex + 1 < commandHistory.length ? cmdIndex + 1 : cmdIndex;
        setCmdIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex > 0) {
        const nextIdx = cmdIndex - 1;
        setCmdIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (cmdIndex === 0) {
        setCmdIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = COMMANDS.find((c) => c.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <div className="terminal-panel" onClick={() => inputRef.current && inputRef.current.focus()}>
      {/* Terminal Title Bar */}
      <div className="terminal-titlebar">
        <div className="titlebar-controls">
          <span className="dot dot--red" />
          <span className="dot dot--amber" />
          <span className="dot dot--green" />
        </div>
        <div className="titlebar-title">visitor@portfolio: ~ (cluster shell)</div>
        <div className="titlebar-actions">
          {booting && (
            <button type="button" className="btn-skip-boot" onClick={handleSkipBoot}>
              Skip boot [Esc]
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body" ref={terminalBodyRef}>
        {/* Boot lines */}
        <div className="terminal-boot-logs">
          {bootLines.map((line, idx) => (
            <div
              key={idx}
              className="term-boot-line"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>

        {/* Command history */}
        {history.map((item, idx) => (
          <div key={idx} className="terminal-history-item">
            <div className="terminal-prompt-line">
              <span className="prompt-user">visitor@portfolio</span>
              <span className="prompt-sep">:</span>
              <span className="prompt-path">~</span>
              <span className="prompt-symbol">$</span>
              <span className="prompt-cmd">{item.command}</span>
            </div>
            {item.output && <div className="terminal-output">{item.output}</div>}
          </div>
        ))}

        {/* Active Input Line */}
        {!booting && (
          <div className="terminal-active-line">
            <span className="prompt-user">visitor@portfolio</span>
            <span className="prompt-sep">:</span>
            <span className="prompt-path">~</span>
            <span className="prompt-symbol">$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
              aria-label="Terminal command input"
              autoFocus
            />
            <span className="terminal-cursor" />
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      <style>{`
        .terminal-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), var(--highlight);
          display: flex;
          flex-direction: column;
          font-family: var(--font-mono);
          min-height: 340px;
          cursor: text;
        }
        .terminal-titlebar {
          background: rgba(24, 33, 45, 0.95);
          border-bottom: 1px solid var(--line);
          padding: 8px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
          user-select: none;
        }
        .titlebar-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .dot--red { background: #FF6B7A; opacity: 0.8; }
        .dot--amber { background: #F5B544; opacity: 0.8; }
        .dot--green { background: #34D3A1; opacity: 0.8; }
        .titlebar-title {
          font-weight: 500;
        }
        .btn-skip-boot {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-skip-boot:hover {
          background: rgba(124, 196, 255, 0.1);
        }
        .terminal-body {
          padding: 16px;
          font-size: 0.88rem;
          line-height: 1.5;
          flex: 1;
          overflow-y: auto;
          max-height: 460px;
        }
        .term-boot-line {
          color: var(--text-muted);
          margin-bottom: 4px;
          animation: termFade 120ms ease;
        }
        @keyframes termFade {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .terminal-prompt-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }
        .prompt-user {
          color: var(--accent);
        }
        .prompt-sep {
          color: var(--text-muted);
        }
        .prompt-path {
          color: #F5B544;
        }
        .prompt-symbol {
          color: var(--text-muted);
        }
        .prompt-cmd {
          color: var(--text);
          font-weight: 500;
        }
        .terminal-active-line {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          position: relative;
        }
        .terminal-input {
          background: transparent;
          border: none;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 0.88rem;
          outline: none;
          flex: 1;
          caret-color: transparent;
          padding: 0;
          margin: 0;
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          animation: cursorBlink 1s infinite;
          vertical-align: middle;
        }
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .terminal-output {
          padding: 6px 0 6px 12px;
          border-left: 2px solid var(--line);
          margin: 4px 0 8px 4px;
        }
        .term-help {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .term-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 8px;
        }
        .term-cmd {
          color: var(--accent);
        }
        .term-desc {
          color: var(--text-muted);
        }
        .term-output-block {
          color: var(--text);
        }
        .term-highlight {
          color: var(--text);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .term-sub {
          color: var(--accent);
          font-weight: 600;
        }
        .term-error {
          color: var(--fail);
        }

        @media (max-width: 600px) {
          .term-row {
            grid-template-columns: 1fr;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
}
