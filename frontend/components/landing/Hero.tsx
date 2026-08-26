"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="section" style={{ paddingTop: 56, position: "relative", zIndex: 1 }}>
      <div className="container hero-grid">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="eyebrow">
            ✦ Visual Agentic Workflow Platform
          </motion.div>
          <motion.h1
            variants={item}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 5.4vw, 66px)",
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "16px 0",
            }}
          >
            Build AI agents like <span className="gradient-text">connecting dots</span>,
            not writing glue code.
          </motion.h1>
          <motion.p
            variants={item}
            style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.65, maxWidth: 520 }}
          >
            MyFamilyAssistant.ai is a living canvas where triggers, LLM agents, and outputs
            snap together into production workflows — compiled to LangGraph and ready to run.
          </motion.p>
          <motion.div
            variants={item}
            style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}
          >
            <Link href="/canvas" className="btn btn-primary">
              Open the Studio →
            </Link>
            <a href="#how" className="btn btn-ghost">
              See how it works
            </a>
          </motion.div>
          <motion.div
            variants={item}
            style={{
              display: "flex",
              gap: 22,
              marginTop: 34,
              color: "var(--muted)",
              fontSize: 13,
              flexWrap: "wrap",
            }}
          >
            <span>⚡ No infra to manage</span>
            <span>🔒 Runs in your tenant</span>
            <span>🧩 40+ integrations</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ position: "relative" }}
        >
          <div className="hero-visual" style={{ padding: 14 }}>
            <img
              src="/hero.png"
              alt="MyFamilyAssistant.ai"
              style={{ width: "100%", borderRadius: 16, display: "block" }}
            />
          </div>
          <img
            src="/aibub.png"
            alt=""
            style={{
              position: "absolute",
              width: 88,
              right: -6,
              bottom: -30,
              filter: "drop-shadow(0 12px 30px rgba(124,58,237,0.5))",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
