import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const resourceCategories = [
  {
    title: "Documentation",
    description: "Guides for building, connecting, and running agents on the canvas — from your first node to production scale.",
    href: "/resources/documentation",
    icon: "📚",
    items: [
      "Getting Started",
      "Canvas Basics",
      "Connectors & Integrations",
      "Model Configuration",
      "Testing & Debugging",
      "Deployment & Scaling",
    ],
  },
  {
    title: "Templates",
    description: "Start from a ready-made workflow: meal planner, bill tracker, trip coordinator, and more.",
    href: "/resources/templates",
    icon: "📋",
    items: [
      "Family Organization",
      "Finance & Budget",
      "Communication",
      "Home & Garden",
      "Learning & Development",
      "Health & Wellness",
    ],
  },
  {
    title: "Blog",
    description: "Product updates, family-automation ideas, and stories from people running real workflows at home.",
    href: "/blog",
    icon: "✍️",
    items: [
      "Getting Started Guides",
      "Advanced Techniques",
      "Product Updates",
      "Community Stories",
      "Tutorials",
      "Best Practices",
    ],
  },
  {
    title: "Changelog",
    description: "Every shipped improvement, model addition, and connector — in one timeline you can follow.",
    href: "/resources/changelog",
    icon: "📈",
    items: [
      "New Features",
      "Bug Fixes",
      "Performance",
      "Integrations",
      "UI Updates",
      "Behind the Scenes",
    ],
  },
  {
    title: "Community",
    description: "Swap workflows, get unstuck, and share what your family assistants automate.",
    href: "/resources/community",
    icon: "🤝",
    items: [
      "Shared Workflows",
      "Help & Support",
      "Showcase",
      "Feature Requests",
      "Community Challenges",
      "Discussions",
    ],
  },
  {
    title: "University",
    description: "Self-paced tracks that take you from curious to confident building agentic workflows.",
    href: "/resources/university",
    icon: "🎓",
    items: [
      "Foundations Track",
      "Builder Track",
      "Advanced Track",
      "Integration Masterclass",
      "Performance Optimization",
      "Certification Path",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <MarketingPage
      eyebrow="◆ Resources"
      title="Everything you need to build with confidence"
      subtitle="Docs, templates, and a community of builders — so you spend your time on outcomes, not setup."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {resourceCategories.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="card"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{resource.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
                  {resource.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>
                  {resource.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    paddingTop: 16,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {resource.items.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "rgba(168, 85, 247, 0.1)",
                        color: "var(--cyan)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section
        className="section"
        style={{
          paddingTop: 48,
          paddingBottom: 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Our Resources by the Numbers
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
            }}
          >
            {[
              { label: "Documentation Articles", value: "120+" },
              { label: "Ready-Made Templates", value: "40+" },
              { label: "Blog Posts", value: "60+" },
              { label: "Community Workflows", value: "500+" },
              { label: "Video Tutorials", value: "30+" },
              { label: "Community Members", value: "2,000+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="glass"
                style={{
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--cyan)",
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Where do you want to start?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Choose your path: follow a guided tutorial, explore a template, or dive into our documentation.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/resources/documentation" className="btn btn-primary">
              Read Docs →
            </Link>
            <Link href="/resources/templates" className="btn btn-ghost">
              Browse Templates →
            </Link>
            <Link href="/blog" className="btn btn-ghost">
              Learn on Blog →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
