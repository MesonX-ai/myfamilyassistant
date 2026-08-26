"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1100px 560px at 50% -12%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(900px 520px at 100% 0%, rgba(34,211,238,0.14), transparent 60%)",
        }}
      />
      <motion.div
        animate={{ y: [0, -34, 0], x: [0, 22, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-8%",
          left: "6%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <motion.div
        animate={{ y: [0, 26, 0], x: [0, -18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-14%",
          right: "5%",
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.42), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(ellipse at 50% 28%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 28%, black, transparent 78%)",
        }}
      />
    </div>
  );
}
