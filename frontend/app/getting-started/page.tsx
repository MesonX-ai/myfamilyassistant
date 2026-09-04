import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";

const quickstartSteps = [
  {
    step: 1,
    title: "Open the Canvas",
    description: "Click the 'Open Studio' button to access the visual workflow builder.",
    time: "30 seconds",
    icon: "lucide:target",
  },
  {
    step: 2,
    title: "Choose a Template or Start Blank",
    description: "Pick a ready-made template or create a workflow from scratch.",
    time: "1 minute",
    icon: "lucide:clipboard",
  },
  {
    step: 3,
    title: "Add Your First Node",
    description: "Drag a trigger node (time, event, or manual) onto the canvas.",
    time: "1 minute",
    icon: "lucide:link",
  },
  {
    step: 4,
    title: "Connect a Model",
    description: "Add Claude or another model to make decisions based on your data.",
    time: "2 minutes",
    icon: "lucide:brain",
  },
  {
    step: 5,
    title: "Add an Output",
    description: "Connect an action node to do something with the result (notification, email, etc).",
    time: "2 minutes",
    icon: "lucide:send",
  },
  {
    step: 6,
    title: "Test and Deploy",
    description: "Run a test to make sure it works, then activate your workflow.",
    time: "2 minutes",
    icon: "lucide:check-circle",
  },
];

const whyAutomate = [
  {
    title: "Save Time",
    description: "Stop doing repetitive tasks. Automation handles them 24/7.",
    examples: ["Bill reminders", "Meal planning", "Schedule coordination"],
  },
  {
    title: "Reduce Stress",
    description: "Never miss important dates or deadlines. Stay organized effortlessly.",
    examples: ["Birthday alerts", "Payment reminders", "Event scheduling"],
  },
  {
    title: "Empower Your Family",
    description: "Give everyone access to shared information and decisions.",
    examples: ["Shared calendars", "Family digest", "Collaborative workflows"],
  },
  {
    title: "Build Smarter",
    description: "Use AI to make intelligent decisions without coding.",
    examples: ["Smart categorization", "Recommendation engine", "Natural language processing"],
  },
];

const commonUseCase = [
  {
    category: "Organization",
    workflows: [
      "Weekly meal planner",
      "Bill tracker and reminders",
      "Chore scheduler",
      "Trip coordinator",
    ],
  },
  {
    category: "Communication",
    workflows: [
      "Weekly family digest",
      "Birthday reminders",
      "Event notifications",
      "Important date alerts",
    ],
  },
  {
    category: "Finance",
    workflows: [
      "Budget tracker",
      "Expense categorizer",
      "Savings goal monitor",
      "Bill consolidation",
    ],
  },
  {
    category: "Learning",
    workflows: [
      "Study scheduler",
      "Vocabulary builder",
      "Reading list manager",
      "Progress tracker",
    ],
  },
];

export default function GettingStartedPage() {
  return (
    <MarketingPage
      eyebrow="◆ Getting Started"
      title="Build your first automation in 10 minutes"
      subtitle="No coding required. Just drag, drop, and automate."
    >
      {/* Quick Start Timeline */}
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--cyan)",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Icon icon="lucide:timer" width={32} height={32} style={{ color: "var(--cyan)" }} />
              10 Minutes to Success
            </div>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>Follow these 6 simple steps</p>
          </div>

          {/* Timeline */}
          <div
            style={{
              position: "relative",
              paddingBottom: 40,
            }}
          >
            {/* Steps */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {quickstartSteps.map((item, idx) => (
                <div
                  key={idx}
                  className="glass"
                  style={{
                    padding: 20,
                    position: "relative",
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #a855f7, #6366f1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#0a0a14",
                      marginBottom: 12,
                      fontSize: 16,
                    }}
                  >
                    {item.step}
                  </div>

                  {/* Content */}
                  <Icon icon={item.icon} width={24} height={24} style={{ marginBottom: 8, color: "var(--cyan)" }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5, margin: "0 0 12px" }}>
                    {item.description}
                  </p>
                  <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600 }}>
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/canvas" className="btn btn-primary">
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Automate */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>
            Why automate your family life?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {whyAutomate.map((reason, idx) => (
              <div key={idx} className="glass" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {reason.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {reason.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {reason.examples.map((ex, eidx) => (
                    <div key={eidx} style={{ fontSize: 13, color: "var(--text)" }}>
                      ✓ {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Use Cases */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>
            What can you automate?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {commonUseCase.map((useCase, idx) => (
              <div key={idx} className="card" style={{ padding: 24 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "var(--cyan)",
                  }}
                >
                  {useCase.category}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {useCase.workflows.map((wf, widx) => (
                    <div key={widx} style={{ fontSize: 14, color: "var(--text)" }}>
                      • {wf}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Resources */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>
            Learn as you build
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "📚",
                title: "Documentation",
                description: "Complete guides and API reference for everything",
                href: "/resources/documentation",
              },
              {
                icon: "📋",
                title: "Templates",
                description: "40+ ready-made workflows to start with",
                href: "/resources/templates",
              },
              {
                icon: "🎓",
                title: "University",
                description: "Self-paced learning tracks and courses",
                href: "/resources/university",
              },
              {
                icon: "📝",
                title: "Blog",
                description: "Tutorials, tips, and success stories",
                href: "/blog",
              },
              {
                icon: "🤝",
                title: "Community",
                description: "Get help and share your workflows",
                href: "/resources/community",
              },
              {
                icon: "📈",
                title: "Changelog",
                description: "See what's new and coming soon",
                href: "/resources/changelog",
              },
            ].map((resource, idx) => (
              <Link
                key={idx}
                href={resource.href}
                className="card"
                style={{
                  textDecoration: "none",
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{resource.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
                  {resource.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                q: "Do I need coding experience?",
                a: "No! The canvas is designed for everyone. No coding required. Just drag and drop.",
              },
              {
                q: "Can I use my favorite tools?",
                a: "Yes. We integrate with Google Workspace, Slack, Gmail, and 50+ other services. Can't find yours? Use our webhook API.",
              },
              {
                q: "Is my data private?",
                a: "Absolutely. Your workflows and data are private by default. You control who sees what. We comply with GDPR and CCPA.",
              },
              {
                q: "Can I share workflows with my family?",
                a: "Yes! You can share with view-only access, or collaborate in real-time with edit permissions.",
              },
              {
                q: "What if something goes wrong?",
                a: "We have detailed debugging tools to see exactly what happened. Check the logs or re-run with breakpoints.",
              },
              {
                q: "How much does it cost?",
                a: "Check our pricing page for plans that fit your needs. We offer free tier for getting started.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="card"
                style={{
                  padding: 20,
                  cursor: "pointer",
                  marginBottom: 0,
                }}
              >
                <summary
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--text)",
                    cursor: "pointer",
                  }}
                >
                  {item.q}
                </summary>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
              Ready? Let's build
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Open the studio and create your first workflow in 10 minutes. We'll guide you every step of the way.
            </p>
            <Link href="/canvas" className="btn btn-primary">
              Open Studio →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
