"use client";

import { motion } from "framer-motion";

type IconProps = { d: string };

const Icon = ({ d }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const features = [
  {
    t: "Living Visual Canvas",
    d: "Drag, snap, and rewire nodes in real time. The graph is the single source of truth — no YAML, no hidden config.",
    d1: "M3 7l9-4 9 4-9 4-9-4z",
    d2: "M3 12l9 4 9-4 M3 17l9 4 9-4",
  },
  {
    t: "Composable LLM Agents",
    d: "Drop in Claude, GPT, or Titan models behind typed agent nodes. Swap models without touching the flow.",
    d1: "M12 3v3 M12 18v3 M3 12h3 M18 12h3",
    d2: "M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1",
  },
  {
    t: "One-click Compile",
    d: "Your canvas compiles straight to a LangGraph state machine — validated topologically before a single token runs.",
    d1: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  },
  {
    t: "Real-time Telemetry",
    d: "Watch each node pulse as it runs. Trace inputs, outputs, and latency per step without leaving the canvas.",
    d1: "M3 12h4l3 8 4-16 3 8h4",
  },
  {
    t: "Enterprise Security",
    d: "Cognito-issued JWTs, WAF edge protection, and per-tenant isolation baked into every request.",
    d1: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z",
  },
  {
    t: "Elastic Worker Fleet",
    d: "LangGraph workers auto-scale on ECS Fargate, buffered by FIFO queues so bursts never drop a job.",
    d1: "M4 6h16 M4 12h16 M4 18h16 M9 3v18 M15 3v18",
  },
];

export function Features() {
  return (
    <section id="features" className="section" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div style={{ maxWidth: 640 }}>
          <div className="eyebrow">◆ Capabilities</div>
          <h2 className="section-title">Everything you need to ship agents</h2>
          <p className="section-sub">
            From the first node to production scale, the platform handles the plumbing so your team
            stays focused on outcomes.
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: 44 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.t}
              className="card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--grad-soft)",
                  border: "1px solid var(--border)",
                  color: "#c4b5fd",
                  marginBottom: 18,
                }}
              >
                <Icon d={f.d1} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>
                {f.t}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
