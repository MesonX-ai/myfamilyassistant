"use client";

import { motion } from "framer-motion";

const logos = [
  "Northwind",
  "Helix Labs",
  "Brightline",
  "Quanta",
  "Meridian",
  "Cobalt",
  "Lumen",
  "Vertex",
];

export function LogoCloud() {
  return (
    <section style={{ padding: "28px 0 8px", position: "relative", zIndex: 1 }}>
      <div className="container">
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Trusted by teams shipping autonomous workflows
        </p>
        <div style={{ overflow: "hidden", marginTop: 18, maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
          <div className="marquee">
            {[...logos, ...logos].map((l, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "rgba(231,234,243,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
