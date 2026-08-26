"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "40px 32px",
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Sign in to save and access your workflows
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
            OAuth login (Google / GitHub) requires a backend service. This static deployment
            does not include server-side authentication.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center" }}>
            To enable sign-in, deploy the Next.js app to a Node.js host (Vercel, AWS, etc.)
            with the NextAuth API route.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/"
            style={{ color: "var(--cyan)", fontSize: 14, fontWeight: 500 }}
          >
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
