import React from 'react';
import './NetworkSceneFallback.css';

interface NetworkSceneFallbackProps {
  reason?: 'reduced-motion' | 'webgl-disabled' | 'fallback';
}

export const NetworkSceneFallback: React.FC<NetworkSceneFallbackProps> = ({ reason }) => {
  return (
    <div className="network-fallback" aria-label="Abstract technical network diagram">
      <div className="network-fallback-backdrop"></div>
      <svg
        className="network-fallback-svg"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Core Glow */}
        <circle cx="250" cy="250" r="160" fill="url(#core-glow)" />

        {/* Outer Orbital Rings */}
        <ellipse
          cx="250"
          cy="250"
          rx="180"
          ry="90"
          transform="rotate(-25 250 250)"
          stroke="url(#orbit-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          className="orbit-ring orbit-ring-1"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="150"
          ry="80"
          transform="rotate(40 250 250)"
          stroke="url(#orbit-grad-2)"
          strokeWidth="1.5"
          className="orbit-ring orbit-ring-2"
        />
        <circle
          cx="250"
          cy="250"
          r="100"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Network Connections */}
        <line x1="250" y1="250" x2="360" y2="170" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
        <line x1="250" y1="250" x2="140" y2="330" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.5" />
        <line x1="250" y1="250" x2="380" y2="310" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        <line x1="250" y1="250" x2="160" y2="180" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1" />
        <line x1="360" y1="170" x2="380" y2="310" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="140" y1="330" x2="160" y2="180" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Central Hexagonal Core */}
        <polygon
          points="250,210 285,230 285,270 250,290 215,270 215,230"
          fill="rgba(14, 17, 26, 0.9)"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        <circle cx="250" cy="250" r="12" fill="#38bdf8" />
        <circle cx="250" cy="250" r="6" fill="#ffffff" />

        {/* Floating Satellite Nodes */}
        <circle cx="360" cy="170" r="8" fill="#818cf8" className="pulse-node" />
        <circle cx="140" cy="330" r="7" fill="#38bdf8" className="pulse-node" />
        <circle cx="380" cy="310" r="5" fill="#38bdf8" opacity="0.8" />
        <circle cx="160" cy="180" r="6" fill="#818cf8" opacity="0.8" />
        <circle cx="250" cy="90" r="4" fill="#ffffff" opacity="0.6" />
        <circle cx="250" cy="410" r="4" fill="#38bdf8" opacity="0.6" />
      </svg>

      <div className="network-fallback-caption">
        <span className="fallback-tag">
          {reason === 'reduced-motion' ? 'Reduced Motion Mode' : '2D Schematic Architecture'}
        </span>
      </div>
    </div>
  );
};
