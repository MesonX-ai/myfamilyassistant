"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const links = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Showcase", href: "#showcase" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="nav-wrap"
    >
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="vb-logo-beacon">
            <span className="vb-logo-beam" />
            <img src="/logo.png" alt="MyFamilyAssistant.ai" style={{ height: 28, width: "auto", display: "block", borderRadius: 6, position: "relative", zIndex: 2 }} />
          </span>
          MyFamilyAssistant<span className="brand-dot">.ai</span>
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-ghost" href="/login">
            Sign in
          </Link>
          <Link className="btn btn-primary" href="/canvas">
            Open Studio
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
