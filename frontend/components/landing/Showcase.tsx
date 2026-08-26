"use client";

import { motion } from "framer-motion";
import { NodeGraph } from "./NodeGraph";

export function Showcase() {
  return (
    <section id="showcase" className="section" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div className="eyebrow">◆ The Studio</div>
          <h2 className="section-title">A canvas that runs what it draws</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Every node you place is a real, executable step. Connect them, press run, and watch the
            workflow come alive.
          </p>
        </div>

        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: 44, padding: 0, overflow: "hidden" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 10, color: "var(--muted)", fontSize: 13 }}>
              myfamilyassistant.ai/studio
            </span>
          </div>

          <div className="split" style={{ padding: 22, gap: 22 }}>
            <NodeGraph />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <img
                src="/interaction.png"
                alt=""
                style={{
                  width: "100%",
                  borderRadius: 14,
                  display: "block",
                  border: "1px solid var(--border)",
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--cyan)",
                  fontWeight: 700,
                }}
              >
                Run result
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)", margin: 0 }}>
                <span className="gradient-text" style={{ fontWeight: 700 }}>
                  Pipeline Completed Successfully.
                </span>{" "}
                Captured node output: <em>Parsed via Bedrock Claude 3.5: &quot;Q3 summary&quot;</em>
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {["trigger_processed", "llm_completed", "pipeline_completed"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "5px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(34,211,238,0.4)",
                      color: "#67e8f9",
                      background: "rgba(34,211,238,0.08)",
                    }}
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: 6,
                  padding: 14,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                Latency p50 <strong style={{ color: "var(--text)" }}>12ms</strong> · Workers{" "}
                <strong style={{ color: "var(--text)" }}>4</strong> · Region{" "}
                <strong style={{ color: "var(--text)" }}>us-east-2</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
