import React from "react";
import profile from "../data/profile.json";
import projectsData from "../data/projects.json";
import registryData from "../data/registry.json";

export default function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page">
      <div className="container resume-container">
        {/* Actions bar (hidden in print) */}
        <div className="resume-actions-bar no-print">
          <div className="actions-left">
            <span className="badge badge--ok">verified resume</span>
            <span className="font-mono text-muted">print-ready / ATS compliant</span>
          </div>
          <div className="actions-right">
            <button type="button" className="btn btn--sm btn--primary" onClick={handlePrint}>
              Print / Save as PDF
            </button>
            <a href={profile.resumeFile || "/resume.pdf"} download className="btn btn--sm">
              Download PDF
            </a>
          </div>
        </div>

        {/* Printable Resume Document Sheet */}
        <article className="resume-document">
          {/* Header */}
          <header className="resume-header">
            <h1 className="resume-name">{profile.name}</h1>
            <p className="resume-role">{profile.title}</p>
            <div className="resume-contact-row font-mono">
              <span>{profile.location}</span>
              <span className="sep">&bull;</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span className="sep">&bull;</span>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                github.com/Akshay44776
              </a>
              <span className="sep">&bull;</span>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                linkedin.com/in/akshayk44776
              </a>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="resume-section">
            <h2 className="section-heading">Summary</h2>
            <p className="section-body">{profile.about}</p>
          </section>

          {/* Education */}
          <section className="resume-section">
            <h2 className="section-heading">Education</h2>
            <div className="entries-list">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{edu.degree}</span>
                    <span className="entry-date font-mono">{edu.years}</span>
                  </div>
                  <div className="entry-sub">
                    <span>{edu.institute}</span>
                    <span className="entry-score font-mono">{edu.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Technical Capabilities / Skills */}
          <section className="resume-section">
            <h2 className="section-heading">Technical Skills</h2>
            <div className="skills-categorized">
              <div className="skill-cat-row">
                <span className="cat-label">DevOps & Cloud (Learning/Foundations):</span>
                <span className="cat-items">
                  Docker, Containerization, CI/CD (GitHub Actions), Linux (Edureka Verified), Nginx, Prometheus, Grafana, Kubernetes (ongoing)
                </span>
              </div>
              <div className="skill-cat-row">
                <span className="cat-label">Languages & Frameworks:</span>
                <span className="cat-items">
                  Java, Python, Go (chaincode), TypeScript, Node.js, FastAPI, SQL, HTML/CSS
                </span>
              </div>
              <div className="skill-cat-row">
                <span className="cat-label">Specializations:</span>
                <span className="cat-items">
                  AI Perception (YOLOv8, ArcFace), Distributed Systems, Blockchain (Hyperledger Fabric, Algorand ARC-4)
                </span>
              </div>
            </div>
          </section>

          {/* Selected Engineering Projects */}
          <section className="resume-section">
            <h2 className="section-heading">Projects & Engineering Experience</h2>
            <div className="entries-list">
              {projectsData.map((p) => (
                <div key={p.slug} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{p.name} &mdash; {p.tagline}</span>
                    <span className="entry-date font-mono">{p.year}</span>
                  </div>
                  <div className="entry-stack font-mono">Stack: {p.stack.join(", ")}</div>
                  <ul className="entry-highlights">
                    {p.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Publications */}
          {profile.publications && (
            <section className="resume-section">
              <h2 className="section-heading">Research & Publications</h2>
              <div className="entries-list">
                {profile.publications.map((pub, idx) => (
                  <div key={idx} className="resume-entry">
                    <div className="entry-header">
                      <span className="entry-title">&ldquo;{pub.title}&rdquo;</span>
                      <span className="entry-note font-mono">{pub.note}</span>
                    </div>
                    <div className="entry-sub">
                      <span>{pub.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Honors & Hackathon Achievements */}
          <section className="resume-section">
            <h2 className="section-heading">Awards & Achievements</h2>
            <ul className="entry-highlights">
              <li>
                <strong>First Place</strong> &mdash; ADVAYA 2.0 National Hackathon (Cybersecurity & Blockchain track) &bull; BGSCET, 2026
              </li>
              <li>
                <strong>First Place</strong> &mdash; Breakpoint Ideathon 2026 &bull; Dept. of CSE, SJBIT, 2026
              </li>
              <li>
                <strong>Third Prize</strong> &mdash; Hack.Algo Blockchain Hackathon &bull; GDG on Campus, REVA University, 2026
              </li>
              <li>
                <strong>Second Place</strong> &mdash; Innovathon at IMPULSE &bull; IEEE SJBIT Student Branch, 2026
              </li>
              <li>
                <strong>Best Research Paper Award</strong> &mdash; ICRIET-2025 &bull; KSIT Bengaluru, 2025
              </li>
              <li>
                <strong>Second Place</strong> &mdash; InnovateX Ideathon &bull; Dept. of ISE, SJBIT, 2025
              </li>
            </ul>
          </section>

          {/* Extracurriculars & Languages */}
          <section className="resume-section">
            <h2 className="section-heading">Languages & Extracurriculars</h2>
            <div className="misc-grid">
              <div>
                <strong>Languages:</strong> {profile.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
              </div>
              <div>
                <strong>Activities:</strong> {profile.extracurricular.join(", ")}
              </div>
            </div>
          </section>
        </article>
      </div>

      <style>{`
        .resume-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .resume-container {
          max-width: 860px;
        }
        .resume-actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-5);
          padding: var(--space-3) var(--space-4);
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
        }
        .actions-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
        }
        .actions-right {
          display: flex;
          gap: 8px;
        }
        .resume-document {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 48px;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .resume-header {
          border-bottom: 2px solid var(--line);
          padding-bottom: var(--space-4);
        }
        .resume-name {
          font-size: 2.2rem;
          margin: 0 0 4px;
        }
        .resume-role {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: var(--accent);
          font-weight: 600;
          margin: 0 0 var(--space-3);
        }
        .resume-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .resume-contact-row a {
          color: var(--text);
          text-decoration: none;
        }
        .resume-contact-row a:hover {
          color: var(--accent);
        }
        .sep {
          color: var(--line);
        }
        .resume-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .section-heading {
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--line);
          padding-bottom: 4px;
          margin: 0;
          color: var(--accent);
        }
        .section-body {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .entries-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .resume-entry {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }
        .entry-title {
          font-weight: 600;
          font-size: 0.98rem;
          color: var(--text);
        }
        .entry-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .entry-note {
          font-size: 0.8rem;
          color: var(--ok);
        }
        .entry-sub {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .entry-score {
          font-weight: 600;
          color: var(--text);
        }
        .entry-stack {
          font-size: 0.82rem;
          color: var(--accent);
        }
        .entry-highlights {
          margin: 4px 0 0;
          padding-left: 20px;
          font-size: 0.88rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text);
        }
        .skills-categorized {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.9rem;
        }
        .skill-cat-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 8px;
        }
        .cat-label {
          font-weight: 600;
          color: var(--text);
        }
        .cat-items {
          color: var(--text-muted);
        }
        .misc-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .misc-grid strong {
          color: var(--text);
        }

        /* Print styles */
        @media print {
          .no-print { display: none !important; }
          .resume-page { padding: 0 !important; }
          .resume-document {
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .resume-header { border-bottom: 2px solid #000000 !important; }
          .resume-name, .resume-role, .resume-contact-row, .resume-contact-row a, .section-heading, .section-body, .entry-title, .entry-sub, .entry-highlights, .cat-label, .cat-items, .misc-grid strong {
            color: #000000 !important;
          }
          .entry-date, .entry-stack, .misc-grid {
            color: #333333 !important;
          }
          .section-heading { border-bottom: 1px solid #999999 !important; }
        }

        @media (max-width: 680px) {
          .resume-document {
            padding: 24px;
          }
          .skill-cat-row {
            grid-template-columns: 1fr;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
}
