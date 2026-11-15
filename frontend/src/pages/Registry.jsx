import React, { useState, useEffect, useRef, useMemo } from "react";
import registryData from "../data/registry.json";
import { useApp } from "../context/AppContext";

export default function Registry() {
  const { showToast } = useApp();

  const [filterQuery, setFilterQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("all"); // 'all' | 'course' | 'achievement' | 'research'

  // Modal (Pull) and Drawer (Inspect) states
  const [pullCert, setPullCert] = useState(null);
  const [inspectCert, setInspectCert] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filterInputRef = useRef(null);
  const modalRef = useRef(null);
  const drawerRef = useRef(null);

  // Keyboard shortcut '/' to focus filter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== filterInputRef.current) {
        e.preventDefault();
        if (filterInputRef.current) filterInputRef.current.focus();
      } else if (e.key === "Escape") {
        setPullCert(null);
        setInspectCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Copy digest / credential ID to clipboard
  const copyDigest = (text, label = "Credential ID") => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  };

  // Filter parsing: supports `docker images --filter key=val` syntax or plain text search
  const filteredCerts = useMemo(() => {
    const certs = registryData.certificates || [];
    let query = filterQuery.trim().toLowerCase();

    // Check if query starts with CLI style 'docker images --filter '
    let keyFilter = null;
    let valFilter = null;

    if (query.includes("--filter")) {
      const match = query.match(/--filter\s+([a-zA-Z_-]+)=([^\s]+)/);
      if (match) {
        keyFilter = match[1];
        valFilter = match[2];
      }
    } else if (query.includes("=")) {
      const parts = query.split("=");
      keyFilter = parts[0].trim();
      valFilter = parts[1].trim();
    }

    return certs.filter((c) => {
      // Kind chip filter
      if (kindFilter !== "all" && c.kind !== kindFilter) return false;

      // Key-value CLI filter
      if (keyFilter && valFilter) {
        if (keyFilter === "issuer") {
          return c.issuer && c.issuer.toLowerCase().includes(valFilter);
        }
        if (keyFilter === "kind") {
          return c.kind && c.kind.toLowerCase() === valFilter;
        }
        if (keyFilter === "status") {
          return c.status && c.status.toLowerCase() === valFilter;
        }
        if (keyFilter === "tag") {
          return c.tag && c.tag.toLowerCase().includes(valFilter);
        }
      }

      // Free text search
      if (query && !keyFilter) {
        const matchTitle = c.title && c.title.toLowerCase().includes(query);
        const matchRepo = c.repository && c.repository.toLowerCase().includes(query);
        const matchIssuer = c.issuer && c.issuer.toLowerCase().includes(query);
        const matchSkills = c.skills && c.skills.some((s) => s.toLowerCase().includes(query));
        const matchDigest = (c.credentialId && c.credentialId.toLowerCase().includes(query)) ||
                            (c.digest && c.digest.toLowerCase().includes(query));
        return matchTitle || matchRepo || matchIssuer || matchSkills || matchDigest;
      }

      return true;
    });
  }, [filterQuery, kindFilter]);

  return (
    <div className="registry-page">
      <div className="container">
        {/* Header Section */}
        <div className="registry-header">
          <div className="header-meta">
            <span className="section-eyebrow">oci artifact registry</span>
            <span className="badge badge--ok">
              {registryData.certificates?.length || 0} images verified
            </span>
          </div>
          <h1 className="registry-title">Artifact Registry</h1>
          <p className="registry-desc">
            Verified credentials, academic publications, and hackathon awards distributed as cryptographically verifiable container images.
          </p>
        </div>

        {/* Credential Gallery (flat, legible cards replace the old 3D floating plates) */}
        <div className="cert-gallery">
          {filteredCerts.map((cert) => {
            const isImage = cert.file && /\.(jpe?g|png|webp)$/i.test(cert.file);
            return (
              <button
                key={cert.repository}
                type="button"
                className={`cert-card cert-card--${cert.kind}`}
                onClick={() => {
                  setPullCert(cert);
                  setZoomLevel(1);
                }}
                aria-label={`Open ${cert.title}`}
              >
                <div className="cert-thumb">
                  {isImage ? (
                    <img src={cert.file} alt="" loading="lazy" />
                  ) : (
                    <span className="cert-thumb-pdf font-mono">PDF</span>
                  )}
                </div>
                <div className="cert-meta">
                  <span className="cert-kind font-mono">{cert.kind}</span>
                  <span className="cert-title">{cert.title}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* In-Progress Pipeline Courses Row */}
        {registryData.inProgress && registryData.inProgress.length > 0 && (
          <div className="panel in-progress-card">
            <div className="in-progress-header">
              <div className="ip-title-group">
                <span className="badge badge--warn badge--pulse">running pipeline</span>
                <span className="ip-repo">in-progress/learning-tracks</span>
              </div>
              <span className="ip-eta">
                ETA: {registryData.inProgress[0].eta.startsWith("{{") ? "Q1 2027 (in progress)" : registryData.inProgress[0].eta}
              </span>
            </div>

            {registryData.inProgress.map((course) => (
              <div key={course.name} className="pipeline-course-row">
                <div className="course-info">
                  <span className="course-name font-mono">{course.name}</span>
                  <span className="course-progress font-mono">{course.progress}% completed</span>
                </div>

                {/* Pipeline Stages: [ build ] -> [ test ] -> [ scan ] -> [ deploy ] */}
                <div className="pipeline-stages-track">
                  {[
                    { stage: "build", status: "running" },
                    { stage: "test", status: "pending" },
                    { stage: "scan", status: "pending" },
                    { stage: "deploy", status: "pending" }
                  ].map((s, idx) => (
                    <React.Fragment key={s.stage}>
                      <div className={`pipeline-stage-pill stage--${s.status}`}>
                        <span className="stage-dot" />
                        <span className="stage-name">{s.stage}</span>
                      </div>
                      {idx < 3 && <div className="stage-connector" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Artifacts Table & Search Bar */}
        <div className="registry-table-section">
          {/* CLI Filter Toolbar */}
          <div className="filter-toolbar">
            <div className="cli-input-wrapper">
              <span className="cli-prefix font-mono">$ docker images</span>
              <input
                ref={filterInputRef}
                type="text"
                className="cli-filter-input font-mono"
                placeholder="--filter kind=achievement | issuer=aws | search..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                aria-label="Filter registry images"
              />
              {filterQuery && (
                <button
                  type="button"
                  className="btn-clear-filter font-mono"
                  onClick={() => setFilterQuery("")}
                >
                  clear
                </button>
              )}
              <span className="kbd-shortcut font-mono">press /</span>
            </div>

            {/* Kind filter chips */}
            <div className="kind-chips">
              {[
                { id: "all", label: "all artifacts" },
                { id: "course", label: "courses" },
                { id: "achievement", label: "achievements" },
                { id: "research", label: "research" }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`filter-chip ${kindFilter === id ? "active" : ""}`}
                  onClick={() => setKindFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="panel table-panel">
            {filteredCerts.length === 0 ? (
              <div className="empty-registry-state">
                <p className="empty-title">No credentials matched the current filter.</p>
                <p className="empty-hint">
                  Reset the search or add new entries to <code className="font-mono">registry.json</code>.
                </p>
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => {
                    setFilterQuery("");
                    setKindFilter("all");
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="table-responsive">
                  <table className="registry-table">
                    <thead>
                      <tr>
                        <th>repository</th>
                        <th>tag</th>
                        <th>digest</th>
                        <th>issued</th>
                        <th>status</th>
                        <th style={{ textAlign: "right" }}>actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCerts.map((cert) => {
                        const displayDigest = cert.credentialId || (cert.digest ? cert.digest.slice(7, 19) : "pending");
                        const fullDigest = cert.credentialId || cert.digest || "";
                        const isVerified = cert.status === "verified";

                        return (
                          <tr key={cert.repository} className="registry-row">
                            <td className="cell-repo">
                              <span className="font-mono repo-name">{cert.repository}</span>
                              <span className="repo-title">{cert.title}</span>
                            </td>

                            <td className="cell-tag font-mono">
                              <span className="tag-pill">{cert.tag}</span>
                            </td>

                            <td className="cell-digest font-mono">
                              <div className="digest-box">
                                <span>{displayDigest}</span>
                                {fullDigest && (
                                  <button
                                    type="button"
                                    className="btn-copy-digest"
                                    onClick={() => copyDigest(fullDigest, cert.credentialId ? "Credential ID" : "SHA256 Digest")}
                                    title="Copy digest"
                                    aria-label="Copy digest"
                                  >
                                    📋
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="cell-issued font-mono">
                              {cert.issued.startsWith("{{") ? (
                                <span className="details-pending-badge">pending</span>
                              ) : (
                                cert.issued
                              )}
                            </td>

                            <td className="cell-status">
                              {isVerified && cert.verifyUrl ? (
                                <a
                                  href={cert.verifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="badge badge--ok cosign-badge"
                                  title="cosign verify: Signature verified"
                                >
                                  verified &#x2197;
                                </a>
                              ) : (
                                <span className={`badge badge--${cert.status === "on-file" ? "ok" : "pending"}`}>
                                  {cert.status}
                                </span>
                              )}
                            </td>

                            <td className="cell-actions" style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="btn btn--sm btn-pull"
                                onClick={() => {
                                  setPullCert(cert);
                                  setZoomLevel(1);
                                }}
                              >
                                Pull
                              </button>
                              <button
                                type="button"
                                className="btn btn--sm"
                                onClick={() => setInspectCert(cert)}
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Card View */}
                <div className="mobile-cards-view">
                  {filteredCerts.map((cert) => {
                    const displayDigest = cert.credentialId || (cert.digest ? cert.digest.slice(7, 19) : "pending");
                    const fullDigest = cert.credentialId || cert.digest || "";

                    return (
                      <div key={cert.repository} className="mobile-cert-card">
                        <div className="mobile-card-header">
                          <span className="font-mono mobile-repo">{cert.repository}</span>
                          <span className="tag-pill font-mono">{cert.tag}</span>
                        </div>
                        <div className="mobile-card-title">{cert.title}</div>
                        <div className="mobile-card-meta">
                          <span className="font-mono">issued: {cert.issued}</span>
                          <span className={`badge badge--${cert.status === "verified" || cert.status === "on-file" ? "ok" : "pending"}`}>
                            {cert.status}
                          </span>
                        </div>
                        <div className="mobile-card-digest font-mono">
                          <span>digest: {displayDigest}</span>
                          <button
                            type="button"
                            className="btn-copy-digest"
                            onClick={() => copyDigest(fullDigest)}
                            aria-label="Copy digest"
                          >
                            📋
                          </button>
                        </div>
                        <div className="mobile-card-actions">
                          <button
                            type="button"
                            className="btn btn--sm btn--primary"
                            onClick={() => {
                              setPullCert(cert);
                              setZoomLevel(1);
                            }}
                          >
                            Pull Image
                          </button>
                          <button
                            type="button"
                            className="btn btn--sm"
                            onClick={() => setInspectCert(cert)}
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Release Notes Changelog (Achievements) */}
        <div className="release-notes-section">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">release chronology</span>
              <h2 className="section-title">Milestones & Achievements</h2>
            </div>
          </div>

          <div className="timeline-container">
            {registryData.releases.map((release) => {
              const isMajor = release.version.endsWith(".0.0");
              return (
                <div key={release.version} className={`timeline-node ${isMajor ? "timeline-node--major" : ""}`}>
                  <div className="node-marker-col">
                    <span className="node-dot" />
                    <span className="node-stem" />
                  </div>
                  <div className="panel node-content">
                    <div className="node-header">
                      <span className="node-version font-mono">{release.version}</span>
                      <span className="node-date font-mono">
                        {release.date.startsWith("{{") ? "date pending" : release.date}
                      </span>
                    </div>
                    <h3 className="node-title">{release.title}</h3>
                    <ul className="node-notes-list">
                      {release.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subsystem Skills Health Panel */}
        <div className="skills-health-section">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">subsystem inventory</span>
              <h2 className="section-title">Skill Health Assessment</h2>
            </div>
          </div>

          <div className="skills-grid">
            {registryData.skills.map((skill) => (
              <div key={skill.name} className="panel skill-health-card">
                <div className="sh-top">
                  <span className="sh-name">{skill.name}</span>
                  <span className={`badge badge--${skill.status === "healthy" ? "ok" : "warn"}`}>
                    {skill.status}
                  </span>
                </div>
                <div className="sh-track">
                  <div
                    className={`sh-fill ${skill.status === "healthy" ? "fill--ok" : "fill--warn"}`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="sh-footer font-mono">
                  <span>level: {skill.level}%</span>
                  <span>status: {skill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PULL CERTIFICATE MODAL */}
      {pullCert && (
        <div className="modal-overlay" onClick={() => setPullCert(null)}>
          <div
            className="modal-card pull-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="badge badge--ok" style={{ marginBottom: "4px" }}>
                  docker pull {pullCert.repository}:{pullCert.tag}
                </span>
                <h2 id="modal-title" className="modal-title">
                  {pullCert.title}
                </h2>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setPullCert(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="cert-viewer-wrapper">
                {pullCert.file.endsWith(".pdf") ? (
                  <div className="pdf-embed-box">
                    <object
                      data={pullCert.file}
                      type="application/pdf"
                      width="100%"
                      height="460px"
                    >
                      <p>
                        PDF preview not supported by your browser.{" "}
                        <a href={pullCert.file} target="_blank" rel="noopener noreferrer">
                          Download certificate PDF directly
                        </a>
                      </p>
                    </object>
                  </div>
                ) : (
                  <div className="image-zoom-box">
                    <img
                      src={pullCert.file}
                      alt={pullCert.title}
                      className="cert-img"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {!pullCert.file.endsWith(".pdf") && (
                <div className="zoom-controls">
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                  >
                    Zoom -
                  </button>
                  <span className="font-mono" style={{ fontSize: "0.8rem" }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  >
                    Zoom +
                  </button>
                </div>
              )}

              <div className="modal-actions">
                <a href={pullCert.file} download className="btn btn--sm btn--primary">
                  Download artifact file
                </a>
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => setPullCert(null)}
                >
                  Close [Esc]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT DRAWER PANEL */}
      {inspectCert && (
        <div className="drawer-overlay" onClick={() => setInspectCert(null)}>
          <aside
            className="drawer-panel"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            aria-label="Artifact inspection panel"
          >
            <div className="drawer-header">
              <div>
                <span className="section-eyebrow font-mono">docker inspect</span>
                <h2 className="drawer-title">{inspectCert.repository}</h2>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setInspectCert(null)}
                aria-label="Close inspect panel"
              >
                ✕
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-section">
                <div className="drawer-label">Full Title:</div>
                <div className="drawer-val font-display" style={{ fontWeight: 600 }}>
                  {inspectCert.title}
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-label">Issuer:</div>
                <div className="drawer-val">{inspectCert.issuer}</div>
              </div>

              <div className="drawer-section">
                <div className="drawer-label">Status & Verification:</div>
                <div className="drawer-val" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`badge badge--${inspectCert.status === "verified" ? "ok" : "warn"}`}>
                    {inspectCert.status}
                  </span>
                  {inspectCert.verifyUrl && (
                    <a href={inspectCert.verifyUrl} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: "0.8rem" }}>
                      Verify with issuer &rarr;
                    </a>
                  )}
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-label">Credential ID / Digest:</div>
                <div className="font-mono drawer-digest-box">
                  <code>{inspectCert.credentialId || inspectCert.digest}</code>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => copyDigest(inspectCert.credentialId || inspectCert.digest)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {inspectCert.skills && inspectCert.skills.length > 0 && (
                <div className="drawer-section">
                  <div className="drawer-label">Skills Covered:</div>
                  <div className="drawer-skills-row">
                    {inspectCert.skills.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {inspectCert.eventDate && (
                <div className="drawer-section">
                  <div className="drawer-label">Event Date:</div>
                  <div className="drawer-val font-mono">{inspectCert.eventDate}</div>
                </div>
              )}

              {inspectCert.coAuthors && (
                <div className="drawer-section">
                  <div className="drawer-label">Co-Authors:</div>
                  <div className="drawer-val">{inspectCert.coAuthors.join(", ")}</div>
                </div>
              )}

              {/* Raw JSON Inspect */}
              <div className="drawer-section">
                <div className="drawer-label">Raw Image Manifest:</div>
                <pre className="raw-json-block font-mono">
                  {JSON.stringify(inspectCert, null, 2)}
                </pre>
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  setPullCert(inspectCert);
                  setInspectCert(null);
                }}
              >
                Pull and View File &rarr;
              </button>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .registry-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .registry-header {
          margin-bottom: var(--space-6);
        }
        .registry-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .registry-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* Credential gallery */
        .cert-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          text-align: left;
          padding: 0;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          color: var(--text);
          font: inherit;
          transition: border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
        }
        .cert-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .cert-card--achievement { border-top: 3px solid var(--warn); }
        .cert-card--research { border-top: 3px solid var(--accent); }
        .cert-card--course { border-top: 3px solid var(--ok); }
        .cert-thumb {
          aspect-ratio: 4 / 3;
          background: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cert-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }
        .cert-thumb-pdf {
          font-size: 1.6rem;
          color: var(--text-muted);
          border: 2px dashed var(--line);
          padding: 10px 18px;
          border-radius: var(--radius-sm);
        }
        .cert-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: var(--space-4);
        }
        .cert-kind {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--accent);
        }
        .cert-title {
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.3;
        }
        .cert-issuer {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* In-Progress Pipeline Courses */
        .in-progress-card {
          margin-bottom: var(--space-6);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .in-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }
        .ip-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ip-repo {
          color: var(--accent);
        }
        .ip-eta {
          color: var(--text-muted);
        }
        .pipeline-course-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 8px;
        }
        .course-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
        }
        .course-name {
          color: var(--text);
          font-weight: 600;
        }
        .course-progress {
          color: var(--warn);
        }
        .pipeline-stages-track {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pipeline-stage-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line);
          background: var(--panel);
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }
        .stage-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
        }
        .stage--running .stage-dot {
          background: var(--warn);
          animation: pulse 1.6s infinite;
        }
        .stage--running {
          border-color: var(--warn);
          color: var(--warn);
        }
        .stage-connector {
          width: 20px;
          height: 2px;
          background: var(--line);
        }

        /* Table and Search */
        .registry-table-section {
          margin-bottom: var(--space-7);
        }
        .filter-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }
        .cli-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 0 12px;
          flex: 1;
          min-width: 280px;
          height: 42px;
        }
        .cli-prefix {
          color: var(--accent);
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .cli-filter-input {
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 0.85rem;
          width: 100%;
          outline: none;
        }
        .btn-clear-filter {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.75rem;
        }
        .kbd-shortcut {
          font-size: 0.7rem;
          color: var(--text-muted);
          border: 1px solid var(--line);
          padding: 2px 4px;
          border-radius: 3px;
          white-space: nowrap;
        }
        .kind-chips {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .filter-chip {
          background: var(--panel);
          border: 1px solid var(--line);
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          transition: all var(--dur-fast) var(--ease);
        }
        .filter-chip:hover {
          color: var(--text);
          border-color: var(--text-muted);
        }
        .filter-chip.active {
          background: rgba(124, 196, 255, 0.12);
          border-color: var(--accent);
          color: var(--accent);
        }

        .table-panel {
          padding: 0;
          overflow: hidden;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .registry-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .registry-table th {
          background: var(--panel-raised);
          padding: 12px 16px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--line);
          text-transform: lowercase;
        }
        .registry-row {
          border-bottom: 1px solid var(--line);
          transition: background var(--dur-fast) var(--ease);
        }
        .registry-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .registry-table td {
          padding: 12px 16px;
          vertical-align: middle;
        }
        .cell-repo {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .repo-name {
          color: var(--accent);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .repo-title {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .tag-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .digest-box {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
        }
        .btn-copy-digest {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          opacity: 0.6;
          padding: 2px;
          transition: opacity var(--dur-fast);
        }
        .btn-copy-digest:hover {
          opacity: 1;
        }
        .details-pending-badge {
          color: var(--warn);
          font-size: 0.78rem;
        }
        .cosign-badge {
          text-decoration: none;
          color: var(--text);
        }
        .cosign-badge:hover {
          border-color: var(--ok);
        }
        .cell-actions {
          white-space: nowrap;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .btn-pull {
          border-color: var(--accent);
          color: var(--accent);
        }
        .btn-pull:hover {
          background: rgba(124, 196, 255, 0.1);
        }

        /* Mobile Cards */
        .mobile-cards-view {
          display: none;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-4);
        }
        .mobile-cert-card {
          background: var(--panel-raised);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mobile-repo {
          color: var(--accent);
          font-size: 0.82rem;
        }
        .mobile-card-title {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .mobile-card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .mobile-card-digest {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          background: rgba(10, 14, 20, 0.5);
          padding: 4px 8px;
          border-radius: 4px;
        }
        .mobile-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        /* Timeline Releases */
        .release-notes-section {
          margin-bottom: var(--space-7);
        }
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          margin-top: var(--space-4);
        }
        .timeline-node {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: var(--space-4);
          position: relative;
        }
        .node-marker-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .node-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 18px;
          z-index: 2;
        }
        .timeline-node--major .node-dot {
          width: 14px;
          height: 14px;
          background: var(--ok);
          box-shadow: 0 0 10px rgba(52, 211, 161, 0.4);
        }
        .node-stem {
          width: 2px;
          flex: 1;
          background: var(--line);
        }
        .node-content {
          margin-bottom: var(--space-4);
          padding: var(--space-4);
        }
        .node-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }
        .node-version {
          color: var(--accent);
          font-weight: 600;
        }
        .node-date {
          color: var(--text-muted);
        }
        .node-title {
          font-size: var(--step-1);
          margin: 0 0 6px;
        }
        .node-notes-list {
          margin: 0;
          padding-left: 18px;
          font-size: 0.88rem;
          color: var(--text);
        }

        /* Skills Health */
        .skills-health-section {
          margin-bottom: var(--space-6);
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-4);
        }
        .skill-health-card {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sh-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sh-name {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .sh-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .sh-fill {
          height: 100%;
          border-radius: var(--radius-pill);
        }
        .sh-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        /* Pull Modal */
        .pull-modal {
          max-width: 760px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-5);
          border-bottom: 1px solid var(--line);
        }
        .modal-title {
          font-size: var(--step-1);
          margin: 0;
        }
        .btn-modal-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .modal-body {
          padding: var(--space-5);
          overflow-y: auto;
          max-height: 60vh;
        }
        .cert-viewer-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--ink);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          overflow: hidden;
          min-height: 320px;
        }
        .pdf-embed-box {
          width: 100%;
        }
        .image-zoom-box {
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px;
          max-height: 480px;
        }
        .cert-img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          transition: transform 0.2s ease;
        }
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-5);
          border-top: 1px solid var(--line);
          background: var(--panel);
        }
        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .modal-actions {
          display: flex;
          gap: 8px;
        }

        /* Inspect Drawer */
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-5);
          border-bottom: 1px solid var(--line);
        }
        .drawer-title {
          font-size: var(--step-1);
          margin: 0;
        }
        .drawer-body {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          flex: 1;
        }
        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .drawer-label {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .drawer-val {
          color: var(--text);
          font-size: 0.92rem;
        }
        .drawer-digest-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--ink);
          border: 1px solid var(--line);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          word-break: break-all;
        }
        .drawer-skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .raw-json-block {
          background: var(--ink);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
          overflow-x: auto;
          max-height: 180px;
        }
        .drawer-footer {
          padding: var(--space-5);
          border-top: 1px solid var(--line);
          background: var(--panel);
        }

        .empty-registry-state {
          padding: 48px 24px;
          text-align: center;
        }
        .empty-title {
          font-weight: 600;
          font-size: var(--step-1);
          margin-bottom: 6px;
        }
        .empty-hint {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-bottom: 16px;
        }

        @media (max-width: 860px) {
          .table-responsive { display: none; }
          .mobile-cards-view { display: flex; }
        }
      `}</style>
    </div>
  );
}
