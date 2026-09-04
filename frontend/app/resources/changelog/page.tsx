import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";

const changelogEntries = [
  {
    version: "2.3.0",
    date: "August 18, 2026",
    type: "Feature Release",
    headline: "Multi-Agent Workflows & Advanced Debugging",
    items: [
      { category: "Features", description: "Chain multiple models in sequence for complex reasoning tasks" },
      {
        category: "Features",
        description: "Visual debugging with execution breakpoints and state inspection",
      },
      { category: "Features", description: "Workflow versioning and rollback support" },
      { category: "Improvement", description: "50% faster workflow execution with caching" },
      { category: "Improvement", description: "Enhanced error messages with suggested fixes" },
      { category: "Bug Fix", description: "Fixed webhook delivery delays in certain timezones" },
    ],
  },
  {
    version: "2.2.5",
    date: "August 4, 2026",
    type: "Improvement",
    headline: "Performance & Stability Updates",
    items: [
      { category: "Improvement", description: "Optimized database queries for faster workflow execution" },
      {
        category: "Improvement",
        description: "Added automatic retry logic for transient failures",
      },
      { category: "Improvement", description: "Better handling of large datasets in workflows" },
      { category: "Bug Fix", description: "Fixed issue with Google Sheets connector freezing on large files" },
      { category: "Bug Fix", description: "Resolved authentication issues with certain OAuth providers" },
    ],
  },
  {
    version: "2.2.0",
    date: "July 21, 2026",
    type: "Feature Release",
    headline: "Privacy Controls & Team Collaboration",
    items: [
      { category: "Features", description: "End-to-end encryption for sensitive workflows" },
      { category: "Features", description: "Granular permission controls for team members" },
      { category: "Features", description: "Audit logs for workflow access and modifications" },
      {
        category: "Features",
        description: "Real-time collaboration with live cursor tracking",
      },
      { category: "Improvement", description: "Redesigned permission interface for clarity" },
      {
        category: "Bug Fix",
        description: "Fixed issue where deleted workflows appeared in search results",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "July 8, 2026",
    type: "Feature Release",
    headline: "Templates Library & Community Workflows",
    items: [
      { category: "Features", description: "40+ ready-made templates for common use cases" },
      { category: "Features", description: "Community workflow marketplace with ratings" },
      { category: "Features", description: "Template versioning and community voting" },
      { category: "Improvement", description: "Improved template discovery with smart recommendations" },
      { category: "Improvement", description: "Better analytics for template usage" },
    ],
  },
  {
    version: "2.0.0",
    date: "June 15, 2026",
    type: "Major Release",
    headline: "The Living Canvas - Complete Redesign",
    items: [
      { category: "Features", description: "Completely redesigned visual canvas interface" },
      { category: "Features", description: "Real-time data flow visualization during execution" },
      { category: "Features", description: "Drag-and-drop workflow builder with 50+ node types" },
      { category: "Features", description: "Support for Claude 3.5, GPT-4o, and Llama models" },
      {
        category: "Improvement",
        description: "Complete redesign with modern UI/UX",
      },
      {
        category: "Improvement",
        description: "Moved from JSON to visual-first workflow definition",
      },
      { category: "Breaking Change", description: "Legacy JSON-based workflows require migration" },
    ],
  },
  {
    version: "1.5.0",
    date: "May 1, 2026",
    type: "Feature Release",
    headline: "Advanced Integrations",
    items: [
      { category: "Features", description: "Native support for 20+ new integrations" },
      { category: "Features", description: "Custom webhook support for any REST API" },
      { category: "Features", description: "Zapier and Make.com compatibility" },
      { category: "Improvement", description: "Better error handling for integration failures" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <MarketingPage
      eyebrow="◆ Changelog"
      title="What's new in the studio"
      subtitle="Every shipped feature, improvement, and fix. One timeline you can follow."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Filter & Search */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 40,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["All", "Features", "Improvements", "Bug Fixes", "Breaking Changes"].map((filter) => (
              <button
                key={filter}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--muted)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical Line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 2,
                background: "linear-gradient(180deg, var(--cyan), var(--violet), transparent)",
                borderRadius: 2,
              }}
            />

            {/* Entries */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
                paddingLeft: 40,
              }}
            >
              {changelogEntries.map((entry, idx) => (
                <div key={idx}>
                  {/* Timeline Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -7,
                      top: 16,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--cyan)",
                      border: "2px solid var(--bg)",
                      boxShadow: "0 0 0 2px var(--cyan)",
                    }}
                  />

                  {/* Content */}
                  <div
                    className="glass"
                    style={{
                      padding: 28,
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        v{entry.version}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background:
                            entry.type === "Major Release"
                              ? "rgba(232, 121, 249, 0.15)"
                              : entry.type === "Feature Release"
                                ? "rgba(168, 85, 247, 0.15)"
                                : "rgba(34, 211, 238, 0.15)",
                          color:
                            entry.type === "Major Release"
                              ? "#e879f9"
                              : entry.type === "Feature Release"
                                ? "#a855f7"
                                : "var(--cyan)",
                          fontWeight: 600,
                        }}
                      >
                        {entry.type}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{entry.date}</span>
                    </div>

                    {/* Headline */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        fontWeight: 700,
                        margin: "0 0 20px",
                      }}
                    >
                      {entry.headline}
                    </h3>

                    {/* Changes List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {entry.items.map((item, iidx) => (
                        <div key={iidx} style={{ display: "flex", gap: 12 }}>
                          <div
                            style={{
                              flexShrink: 0,
                              width: 20,
                              height: 20,
                              borderRadius: 4,
                              background:
                                item.category === "Features"
                                  ? "rgba(168, 85, 247, 0.15)"
                                  : item.category === "Improvement"
                                    ? "rgba(34, 211, 238, 0.15)"
                                    : item.category === "Bug Fix"
                                      ? "rgba(136, 193, 67, 0.15)"
                                      : "rgba(239, 68, 68, 0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              color:
                                item.category === "Features"
                                  ? "#a855f7"
                                  : item.category === "Improvement"
                                    ? "var(--cyan)"
                                    : item.category === "Bug Fix"
                                      ? "#88c143"
                                      : "#ef4444",
                            }}
                          >
                            <Icon
                              icon={
                                item.category === "Features"
                                  ? "lucide:sparkles"
                                  : item.category === "Improvement"
                                    ? "lucide:zap"
                                    : item.category === "Bug Fix"
                                      ? "lucide:bug"
                                      : "lucide:alert-circle"
                              }
                              width={16}
                              height={16}
                              style={{
                                color:
                                  item.category === "Features"
                                    ? "#a855f7"
                                    : item.category === "Improvement"
                                      ? "var(--cyan)"
                                      : item.category === "Bug Fix"
                                        ? "#88c143"
                                        : "#ef4444",
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                              {item.category}
                            </div>
                            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              Stay updated
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Get notified when we ship new features and improvements.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  fontSize: 14,
                }}
              />
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #a855f7 0%, #6366f1 42%, #22d3ee 100%)",
                  color: "#0a0a14",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
