import React from "react";

export default function ClusterFallback({ variant = "cluster", title = "Active Cluster Topology" }) {
  return (
    <div className="cluster-fallback-poster" role="img" aria-label={title}>
      <svg className="cluster-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7CC4FF" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#7CC4FF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0A0E14" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7CC4FF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0A0E14" stopOpacity="0.8" />
          </radialGradient>
          <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Deep background glow */}
        <circle cx="400" cy="250" r="240" fill="url(#clusterGlow)" />

        {/* Ambient star points */}
        <circle cx="120" cy="90" r="1.5" fill="#7CC4FF" opacity="0.4" />
        <circle cx="210" cy="60" r="1" fill="#FFFFFF" opacity="0.5" />
        <circle cx="680" cy="110" r="1.5" fill="#7CC4FF" opacity="0.4" />
        <circle cx="720" cy="380" r="1.2" fill="#FFFFFF" opacity="0.3" />
        <circle cx="150" cy="420" r="1" fill="#7CC4FF" opacity="0.3" />
        <circle cx="620" cy="440" r="1.5" fill="#34D3A1" opacity="0.4" />

        {/* Organic Curved Pipeline Interconnects (Bézier curves) */}
        <path d="M 400 250 Q 280 140 230 150" fill="none" stroke="#7CC4FF" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M 400 250 Q 520 130 570 160" fill="none" stroke="#34D3A1" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M 400 250 Q 260 330 260 360" fill="none" stroke="#7CC4FF" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M 400 250 Q 510 340 530 350" fill="none" stroke="#F5B544" strokeWidth="1.5" strokeOpacity="0.45" />

        {/* Secondary ring lines */}
        <ellipse cx="400" cy="250" rx="260" ry="140" fill="none" stroke="#253246" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        <ellipse cx="400" cy="250" rx="190" ry="100" fill="none" stroke="#7CC4FF" strokeWidth="0.8" opacity="0.2" />

        {/* Central Engineer Core */}
        <circle cx="400" cy="250" r="22" fill="#0A0E14" stroke="#7CC4FF" strokeWidth="2.5" filter="url(#nodeGlow)" />
        <circle cx="400" cy="250" r="10" fill="url(#coreGlow)" className="core-pulse-node" />

        {/* Node 1: ARGUS */}
        <g className="cluster-pod" transform="translate(230, 150)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#111821" stroke="#7CC4FF" strokeWidth="1.8" filter="url(#nodeGlow)" />
          <circle cx="12" cy="-12" r="3.5" fill="#34D3A1" />
          <text x="0" y="34" textAnchor="middle" fill="#E8EEF6" fontSize="11" fontFamily="monospace" fontWeight="600">argus</text>
        </g>

        {/* Node 2: VeriFarm */}
        <g className="cluster-pod" transform="translate(570, 160)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#111821" stroke="#34D3A1" strokeWidth="1.8" filter="url(#nodeGlow)" />
          <circle cx="12" cy="-12" r="3.5" fill="#34D3A1" />
          <text x="0" y="34" textAnchor="middle" fill="#E8EEF6" fontSize="11" fontFamily="monospace" fontWeight="600">verifarm</text>
        </g>

        {/* Node 3: SAATHI */}
        <g className="cluster-pod" transform="translate(260, 360)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#111821" stroke="#7CC4FF" strokeWidth="1.8" filter="url(#nodeGlow)" />
          <circle cx="12" cy="-12" r="3.5" fill="#34D3A1" />
          <text x="0" y="34" textAnchor="middle" fill="#E8EEF6" fontSize="11" fontFamily="monospace" fontWeight="600">saathi</text>
        </g>

        {/* Node 4: AXIOM */}
        <g className="cluster-pod" transform="translate(530, 350)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#111821" stroke="#F5B544" strokeWidth="1.8" filter="url(#nodeGlow)" />
          <circle cx="12" cy="-12" r="3.5" fill="#34D3A1" />
          <text x="0" y="34" textAnchor="middle" fill="#E8EEF6" fontSize="11" fontFamily="monospace" fontWeight="600">axiom</text>
        </g>
      </svg>

      <style>{`
        .cluster-fallback-poster {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(circle at 50% 50%, rgba(124, 196, 255, 0.04) 0%, transparent 75%);
        }
        .cluster-svg {
          width: 100%;
          height: 100%;
          max-height: 520px;
        }
        .core-pulse-node {
          animation: pulseCore 3.5s ease-in-out infinite;
        }
        @keyframes pulseCore {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .core-pulse-node {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
