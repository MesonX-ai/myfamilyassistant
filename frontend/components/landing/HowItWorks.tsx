"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    t: "Design on the canvas",
    d: "Drag a Trigger, wire an LLM Agent, and connect an Output. Every edge is a data hand-off the compiler understands.",
  },
  {
    n: "02",
    t: "Connect your tools",
    d: "Authenticate Vector stores, Slack, databases, and search with per-tenant secrets — pulled at runtime, never hard-coded.",
  },
  {
    n: "03",
    t: "Deploy & observe",
    d: "Hit run and the graph compiles to LangGraph. Watch nodes light up live, then ship it behind the API gateway.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="section" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div style={{ maxWidth: 640 }}>
          <div className="eyebrow">◆ How it works</div>
          <h2 className="section-title">From blank canvas to running agent</h2>
          <p className="section-sub">
            Three moves and your workflow is live. No clusters to provision, no orchestration code to
            maintain.
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: 44 }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="step-num">{s.n}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  margin: "18px 0 8px",
                }}
              >
                {s.t}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
