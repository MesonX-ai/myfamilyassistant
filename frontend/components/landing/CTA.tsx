"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section id="pricing" className="section" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{
            padding: "56px 40px",
            textAlign: "center",
            background:
              "radial-gradient(900px 400px at 50% 0%, rgba(124,58,237,0.22), rgba(255,255,255,0.02))",
          }}
        >
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            ✦ Get started free
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(30px, 4.5vw, 50px)", margin: "12px auto 14px" }}
          >
            Ship your first agent <span className="gradient-text">this afternoon</span>
          </h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Spin up the Studio, connect a model, and deploy a workflow in minutes. No credit card to
            explore the canvas.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/canvas" className="btn btn-primary">
              Open the Studio →
            </Link>
            <a href="#features" className="btn btn-ghost">
              Explore features
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
