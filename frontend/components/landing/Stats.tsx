"use client";

import { motion } from "framer-motion";

const stats = [
  { v: "99.99%", l: "Workflow uptime SLA" },
  { v: "40+", l: "Native integrations" },
  { v: "12ms", l: "Median step latency" },
  { v: "5,000+", l: "Agents in production" },
];

export function Stats() {
  return (
    <section className="section" style={{ paddingTop: 40, position: "relative", zIndex: 1 }}>
      <div className="container">
        <motion.div
          className="glass stats-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{ padding: "40px 28px" }}
        >
          {stats.map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div className="stat-value gradient-text">{s.v}</div>
              <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
