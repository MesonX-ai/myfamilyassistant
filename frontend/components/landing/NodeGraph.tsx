"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "t", x: 70, y: 56, label: "Trigger", sub: "Webhook · Schedule", color: "#22d3ee" },
  { id: "a", x: 296, y: 196, label: "LLM Agent", sub: "Claude · GPT-4o", color: "#7c3aed" },
  { id: "o", x: 536, y: 74, label: "Output", sub: "DB · Slack · Email", color: "#e879f9" },
];

export function NodeGraph() {
  return (
    <div className="hero-visual">
      <div
        className="brand-mark"
        style={{ position: "absolute", top: 14, left: 14, width: 22, height: 22 }}
      />
      <svg viewBox="0 0 640 296" width="100%" height="258" style={{ display: "block" }}>
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M150 86 C 232 86, 232 210, 308 200"
          stroke="url(#edge)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="6 9"
          initial={{ strokeDashoffset: 70 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M376 210 C 456 206, 466 96, 528 92"
          stroke="url(#edge)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="6 9"
          initial={{ strokeDashoffset: 70 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />

        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ y: 0 }}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              x={n.x}
              y={n.y}
              width="94"
              height="58"
              rx="14"
              fill="rgba(10,12,28,0.92)"
              stroke={n.color}
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <circle cx={n.x + 16} cy={n.y + 18} r="5" fill={n.color} />
            <text
              x={n.x + 30}
              y={n.y + 22}
              fill="#e7eaf3"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-display)"
            >
              {n.label}
            </text>
            <text x={n.x + 16} y={n.y + 44} fill="#93a0bd" fontSize="10.5">
              {n.sub}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
