import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const docSections = [
  {
    title: "Getting Started",
    icon: "🚀",
    articles: [
      { title: "Welcome to the Canvas", desc: "A tour of the interface and core concepts" },
      { title: "Your First Workflow", desc: "Build a simple agent in 5 minutes" },
      { title: "Understanding Nodes", desc: "Triggers, models, outputs, and logic" },
      { title: "Running & Testing", desc: "How to test workflows before deployment" },
    ],
  },
  {
    title: "Core Concepts",
    icon: "⚙️",
    articles: [
      { title: "Workflows & Agents", desc: "The difference and when to use each" },
      { title: "Data Flow", desc: "How data moves through your workflow" },
      { title: "Triggers", desc: "Time-based, event-based, and manual triggers" },
      { title: "Models & Prompting", desc: "Using Claude and other LLMs effectively" },
      { title: "Outputs & Actions", desc: "Notifications, logging, integrations" },
    ],
  },
  {
    title: "Connectors & Integrations",
    icon: "🔗",
    articles: [
      { title: "Google Workspace", desc: "Sheets, Calendar, Gmail, Drive" },
      { title: "Communication", desc: "Slack, Discord, SMS, Email" },
      { title: "Finance", desc: "Banking APIs, expense tracking, payments" },
      { title: "Smart Home", desc: "Control devices, get sensor data" },
      { title: "APIs & Webhooks", desc: "Connect any REST API" },
      { title: "Custom Integrations", desc: "Build your own connectors" },
    ],
  },
  {
    title: "Advanced Patterns",
    icon: "🎯",
    articles: [
      { title: "Multi-Agent Workflows", desc: "Chain multiple models for complex reasoning" },
      { title: "Conditional Logic", desc: "Branching, loops, and decisions" },
      { title: "Error Handling", desc: "Retry logic, fallbacks, and alerts" },
      { title: "Performance Optimization", desc: "Caching, parallel execution, batching" },
      { title: "Security Best Practices", desc: "Secrets, permissions, data protection" },
    ],
  },
  {
    title: "Deployment & Operations",
    icon: "🌐",
    articles: [
      { title: "Publishing Workflows", desc: "From draft to production" },
      { title: "Monitoring & Logging", desc: "Track execution, debug issues" },
      { title: "Scaling", desc: "Running high-frequency workflows" },
      { title: "Team Collaboration", desc: "Sharing and versioning workflows" },
      { title: "Backup & Recovery", desc: "Protect your workflows" },
    ],
  },
  {
    title: "Best Practices",
    icon: "✨",
    articles: [
      { title: "Prompt Engineering", desc: "Writing effective model prompts" },
      { title: "Workflow Design", desc: "Structure for maintainability" },
      { title: "Testing Strategy", desc: "Comprehensive workflow testing" },
      { title: "Documentation", desc: "Document your workflows for others" },
      { title: "Privacy & Ethics", desc: "Building responsible automations" },
    ],
  },
];

export default function DocumentationPage() {
  return (
    <MarketingPage
      eyebrow="◆ Documentation"
      title="Complete guides for building with confidence"
      subtitle="From your first node to production-scale automations. Everything is documented, with examples you can run."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          {/* Search Bar */}
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <div
              style={{
                maxWidth: 500,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <input
                type="text"
                placeholder="Search documentation..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  fontSize: 14,
                }}
              />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                🔍
              </span>
            </div>
          </div>

          {/* Documentation Sections */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: 24,
            }}
          >
            {docSections.map((section, idx) => (
              <div key={idx} className="glass" style={{ padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{section.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
                  {section.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {section.articles.map((article, aidx) => (
                    <Link
                      key={aidx}
                      href="#"
                      className="doc-link"
                    >
                      <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                        {article.title}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>{article.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
            API Reference
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[
              { name: "Workflow API", desc: "Create, update, and manage workflows" },
              { name: "Execution API", desc: "Trigger workflows and check status" },
              { name: "Data API", desc: "Read/write workflow data" },
              { name: "Webhooks", desc: "Receive workflow events" },
              { name: "SDKs", desc: "JavaScript, Python, Go clients" },
              { name: "CLI", desc: "Command-line tools for workflows" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="#"
                className="card"
                style={{
                  textDecoration: "none",
                  padding: 24,
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
                  {item.name}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog Teaser */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            See What's New
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            Check out our changelog to see new features, improvements, and bug fixes.
          </p>
          <Link href="/resources/changelog" className="btn btn-primary">
            View Changelog →
          </Link>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              Still need help?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Our community is here to help. Ask a question, share your workflow, or browse discussions.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/resources/community" className="btn btn-primary">
                Join Community →
              </Link>
              <Link href="mailto:support@example.com" className="btn btn-ghost">
                Email Support →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
