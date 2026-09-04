import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";

const communityFeatures = [
  {
    icon: "lucide:upload",
    title: "Share Workflows",
    description: "Publish your workflows for others to use and learn from. Build your reputation as a builder.",
    features: ["Public & private sharing", "Version control", "Usage analytics", "Community reviews"],
  },
  {
    icon: "lucide:help-circle",
    title: "Get Help",
    description: "Ask questions, share problems, and get unstuck. Our community is always ready to help.",
    features: ["Active discussions", "Expert moderators", "Quick responses", "FAQ database"],
  },
  {
    icon: "lucide:star",
    title: "Showcase",
    description: "Show off what you've built. Share your automation stories and celebrate wins with the community.",
    features: ["Featured projects", "Success stories", "Monthly challenges", "Community highlights"],
  },
  {
    icon: "lucide:lightbulb",
    title: "Inspiration",
    description: "Browse thousands of workflows built by the community. Find ideas, templates, and patterns.",
    features: ["Trending workflows", "Search & filter", "Collections", "Recommendations"],
  },
];

const discussionTopics = [
  {
    title: "Getting Started",
    threads: 342,
    latest: "How to debug my first workflow",
    activity: "2 hours ago",
  },
  {
    title: "Integrations",
    threads: 521,
    latest: "Connecting to Notion API",
    activity: "1 hour ago",
  },
  {
    title: "Advanced Techniques",
    threads: 287,
    latest: "Multi-agent workflow patterns",
    activity: "3 hours ago",
  },
  {
    title: "Showcase",
    threads: 198,
    latest: "My family saved 10 hours/week with this workflow",
    activity: "30 min ago",
  },
  {
    title: "Feature Requests",
    threads: 456,
    latest: "Support for Zapier integration",
    activity: "4 hours ago",
  },
  {
    title: "Bugs & Issues",
    threads: 89,
    latest: "Webhook not firing on schedule",
    activity: "1 hour ago",
  },
];

const topContributors = [
  { name: "Sarah Chen", workflows: 24, followers: 1240, badge: "Expert Builder" },
  { name: "Marcus Webb", workflows: 19, followers: 856, badge: "Community Leader" },
  { name: "Priya Desai", workflows: 31, followers: 2100, badge: "Top Contributor" },
  { name: "James Park", workflows: 15, followers: 642, badge: "Helpful Member" },
  { name: "Elena Rodriguez", workflows: 18, followers: 920, badge: "Security Advocate" },
  { name: "Alex Kim", workflows: 12, followers: 456, badge: "Early Contributor" },
];

export default function CommunityPage() {
  return (
    <MarketingPage
      eyebrow="◆ Community"
      title="Join 2,000+ builders making automation real"
      subtitle="Share workflows, get help, find inspiration, and build with other people who understand family automation."
    >
      {/* Community Features */}
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {communityFeatures.map((feature, idx) => (
              <div key={idx} className="glass" style={{ padding: 28 }}>
                <Icon icon={feature.icon} width={32} height={32} style={{ marginBottom: 12, color: idx === 0 ? "var(--cyan)" : idx === 1 ? "var(--violet)" : idx === 2 ? "var(--pink)" : "var(--indigo)" }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {feature.description}
                </p>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {feature.features.map((feat, fidx) => (
                    <li
                      key={fidx}
                      style={{
                        fontSize: 13,
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon icon="lucide:check" width={14} height={14} style={{ color: "var(--cyan)", flexShrink: 0 }} />
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussion Forum Preview */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
            Active Discussions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {discussionTopics.map((topic, idx) => (
              <Link
                key={idx}
                href="#"
                className="card"
                style={{
                  textDecoration: "none",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {topic.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "var(--indigo)",
                    }}
                  >
                    {topic.threads}
                  </span>
                </div>
                <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.5, margin: "0 0 12px", flex: 1 }}>
                  {topic.latest}
                </p>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Active {topic.activity}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
            Featured Contributors
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {topContributors.map((contributor, idx) => (
              <Link
                key={idx}
                href="#"
                className="card"
                style={{
                  textDecoration: "none",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 12,
                  }}
                >
                  👤
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
                  {contributor.name}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "rgba(34, 211, 238, 0.15)",
                    color: "var(--cyan)",
                    display: "inline-block",
                    marginBottom: 12,
                  }}
                >
                  {contributor.badge}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    padding: "12px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cyan)" }}>
                      {contributor.workflows}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Workflows</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cyan)" }}>
                      {contributor.followers.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Followers</div>
                  </div>
                </div>
                <div style={{ color: "var(--cyan)", fontWeight: 600, fontSize: 13 }}>View Profile →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
              How we build together
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
                marginBottom: 24,
              }}
            >
              {[
                {
                  emoji: "❤️",
                  title: "Be Kind",
                  desc: "We're all learning. Help, don't critique.",
                },
                {
                  emoji: "📣",
                  title: "Share",
                  desc: "Your workflow could help someone else.",
                },
                {
                  emoji: "🙏",
                  title: "Give Credit",
                  desc: "Link to workflows and ideas you build on.",
                },
                {
                  emoji: "🔒",
                  title: "Respect Privacy",
                  desc: "Never share others' personal workflows.",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <Link href="#" style={{ color: "var(--cyan)", fontWeight: 600, textDecoration: "none" }}>
                Read full community guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Ready to join?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            Connect with builders, share your workflows, and be part of something bigger.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/canvas" className="btn btn-primary">
              Start Building →
            </Link>
            <Link href="#" className="btn btn-ghost">
              Explore Community →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
