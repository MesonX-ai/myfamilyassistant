"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";

export function Navbar() {
  const links = [
    { label: "Solutions", href: "/solutions" },
    { label: "Resources", href: "/resources" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
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
          <span className="vb-logo-orbit">
            <span className="vb-logo-track" />
            <span className="vb-logo-dot-wrap">
              <span className="vb-logo-dot" />
            </span>
            <span className="vb-logo-dot-wrap alt">
              <span className="vb-logo-dot" />
            </span>
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
          <Link className="btn btn-primary vb-cta-glow" href="/canvas">
            <Icon className="vb-cta-sparkle" icon="lucide:sparkles" />
            Open Studio
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
