import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";

const learningTracks = [
  {
    id: "foundations",
    name: "Foundations Track",
    subtitle: "From zero to hero in workflow building",
    description:
      "Perfect if you're new to automation and want to learn the fundamentals. No prior coding experience needed.",
    icon: "🏗️",
    duration: "4 weeks",
    difficulty: "Beginner",
    modules: [
      {
        title: "Welcome to the Canvas",
        description: "Tour the interface, understand core concepts",
        lessons: 3,
        time: "30 min",
      },
      {
        title: "Building Your First Workflow",
        description: "Create a simple workflow from start to finish",
        lessons: 4,
        time: "1.5 hours",
      },
      {
        title: "Understanding Nodes",
        description: "Deep dive into triggers, models, and outputs",
        lessons: 5,
        time: "2 hours",
      },
      {
        title: "Data & Variables",
        description: "How data flows through your workflows",
        lessons: 4,
        time: "1.5 hours",
      },
      {
        title: "Testing & Debugging",
        description: "Master the debugging tools and test your workflows",
        lessons: 3,
        time: "1 hour",
      },
      {
        title: "First Automation Project",
        description: "Build your first real-world automation",
        lessons: 1,
        time: "2 hours",
      },
    ],
  },
  {
    id: "builder",
    name: "Builder Track",
    subtitle: "Advanced techniques and real-world patterns",
    description:
      "For those ready to level up. Learn complex workflows, integrations, and advanced patterns used by expert builders.",
    icon: "🚀",
    duration: "6 weeks",
    difficulty: "Intermediate",
    modules: [
      {
        title: "Multi-Step Workflows",
        description: "Chain multiple operations and decisions",
        lessons: 4,
        time: "2 hours",
      },
      {
        title: "Conditional Logic & Branching",
        description: "Create workflows that make intelligent decisions",
        lessons: 5,
        time: "2.5 hours",
      },
      {
        title: "Integration Deep Dive",
        description: "Connect with Google Workspace, Slack, and more",
        lessons: 6,
        time: "3 hours",
      },
      {
        title: "Error Handling & Reliability",
        description: "Build workflows that handle failures gracefully",
        lessons: 4,
        time: "2 hours",
      },
      {
        title: "Advanced Prompting",
        description: "Master prompt engineering for better results",
        lessons: 5,
        time: "2.5 hours",
      },
      {
        title: "Performance Optimization",
        description: "Make your workflows fast and efficient",
        lessons: 4,
        time: "2 hours",
      },
      {
        title: "Capstone Project",
        description: "Build a complex workflow from requirements to production",
        lessons: 1,
        time: "4 hours",
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Track",
    subtitle: "Expert-level patterns and architectures",
    description:
      "For advanced builders. Explore sophisticated patterns, team workflows, and production-grade automation.",
    icon: "⭐",
    duration: "8 weeks",
    difficulty: "Advanced",
    modules: [
      {
        title: "Multi-Agent Systems",
        description: "Chain multiple models for complex reasoning",
        lessons: 5,
        time: "3 hours",
      },
      {
        title: "Custom Integrations",
        description: "Build connectors for any API",
        lessons: 6,
        time: "4 hours",
      },
      {
        title: "Workflow Architecture",
        description: "Design scalable, maintainable workflows",
        lessons: 5,
        time: "3 hours",
      },
      {
        title: "Team Collaboration Patterns",
        description: "Workflows that work for distributed teams",
        lessons: 4,
        time: "2 hours",
      },
      {
        title: "Security & Privacy",
        description: "Protect sensitive data in your workflows",
        lessons: 5,
        time: "2.5 hours",
      },
      {
        title: "Monitoring & Operations",
        description: "Run workflows in production with confidence",
        lessons: 4,
        time: "2 hours",
      },
      {
        title: "Advanced Capstone",
        description: "Build an enterprise-grade workflow system",
        lessons: 1,
        time: "8 hours",
      },
    ],
  },
];

const specialCourses = [
  {
    title: "Google Workspace Masterclass",
    description: "Master Gmail, Sheets, Calendar, and Drive integrations",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    title: "AI & LLM Deep Dive",
    description: "Learn prompt engineering and model selection",
    duration: "4 hours",
    level: "Intermediate",
  },
  {
    title: "Family Automation Use Cases",
    description: "Real-world workflows for common family needs",
    duration: "2 hours",
    level: "Beginner",
  },
  {
    title: "Business Automation Patterns",
    description: "Apply family automation to small business workflows",
    duration: "3.5 hours",
    level: "Advanced",
  },
];

export default function UniversityPage() {
  return (
    <MarketingPage
      eyebrow="◆ University"
      title="Learn at your own pace"
      subtitle="Self-paced tracks that take you from curious to confident. Build real workflows as you learn."
    >
      {/* Learning Tracks */}
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {learningTracks.map((track) => (
              <div key={track.id} className="glass" style={{ padding: 28 }}>
                <Icon
                  icon={track.icon === "🏗️" ? "lucide:hammer" : track.icon === "🚀" ? "lucide:rocket" : "lucide:star"}
                  width={32}
                  height={32}
                  style={{
                    marginBottom: 12,
                    color: track.icon === "🏗️" ? "var(--indigo)" : track.icon === "🚀" ? "var(--cyan)" : "var(--violet)",
                  }}
                />

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
                  {track.name}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 16px" }}>{track.subtitle}</p>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
                  {track.description}
                </p>

                {/* Metadata */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 20,
                    paddingBottom: 20,
                    borderBottom: "1px solid var(--border)",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Duration</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{track.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Level</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{track.difficulty}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Modules</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{track.modules.length}</div>
                  </div>
                </div>

                {/* Module List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {track.modules.slice(0, 3).map((module, idx) => (
                    <div key={idx} style={{ fontSize: 13, lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{module.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>
                        {module.lessons} lessons · {module.time}
                      </div>
                    </div>
                  ))}
                  {track.modules.length > 3 && (
                    <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600 }}>
                      +{track.modules.length - 3} more modules
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link href="#" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Start Learning →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Courses */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
            Specialized Courses
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {specialCourses.map((course, idx) => (
              <Link
                key={idx}
                href="#"
                className="card"
                style={{
                  textDecoration: "none",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
                  {course.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                  {course.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{course.duration}</div>
                    <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600 }}>{course.level}</div>
                  </div>
                  <div style={{ color: "var(--cyan)", fontWeight: 600 }}>Enroll →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              Earn Your Certification
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Complete a track and pass the final project to earn a badge. Show your skills to the community and beyond.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {["Foundations", "Builder", "Advanced"].map((level, idx) => (
                <div key={idx} style={{ padding: 12, background: "rgba(168, 85, 247, 0.1)", borderRadius: 8 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>
                    {idx === 0 ? "🥉" : idx === 1 ? "🥈" : "🥇"}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{level}</div>
                </div>
              ))}
            </div>
            <Link href="#" className="btn btn-primary">
              View Certification Path →
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Stats */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
            Learn with our community
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {[
              { stat: "1,500+", label: "Students" },
              { stat: "45+", label: "Courses" },
              { stat: "200+ hrs", label: "Content" },
              { stat: "92%", label: "Completion Rate" },
            ].map((item, idx) => (
              <div key={idx} className="glass" style={{ padding: 20, textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "var(--cyan)",
                    marginBottom: 4,
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Learn CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Ready to learn?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            Choose your track and start learning. You can always switch tracks later.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="#" className="btn btn-primary">
              Start Foundations →
            </Link>
            <Link href="/resources/documentation" className="btn btn-ghost">
              Browse Docs →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
