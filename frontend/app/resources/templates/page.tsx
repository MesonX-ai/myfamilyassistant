import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";

const templates = [
  {
    id: "1",
    name: "Weekly Meal Planner",
    description: "Automatically generate meal plans based on your calendar, dietary preferences, and pantry inventory.",
    category: "Family Organization",
    difficulty: "Intermediate",
    time: "20 min to customize",
    uses: ["Calendar", "Google Sheets", "Claude AI"],
    tags: ["meal-planning", "scheduling", "automation"],
  },
  {
    id: "2",
    name: "Bill Tracker & Reminder",
    description: "Track all family bills, send reminders before due dates, and maintain a payment history.",
    category: "Finance & Budget",
    difficulty: "Beginner",
    time: "10 min to customize",
    uses: ["Google Sheets", "Notification", "Date Calc"],
    tags: ["finance", "budget", "reminders"],
  },
  {
    id: "3",
    name: "Trip Coordinator",
    description: "Plan family trips with itinerary generation, accommodation checks, and expense tracking.",
    category: "Family Organization",
    difficulty: "Advanced",
    time: "30 min to customize",
    uses: ["Calendar", "Google Maps", "Claude AI", "Sheets"],
    tags: ["travel", "planning", "collaboration"],
  },
  {
    id: "4",
    name: "Weekly Family Digest",
    description: "Generate a weekly summary of upcoming events, weather, birthdays, and important dates.",
    category: "Communication",
    difficulty: "Intermediate",
    time: "15 min to customize",
    uses: ["Calendar", "Weather API", "Claude AI"],
    tags: ["digest", "communication", "scheduling"],
  },
  {
    id: "5",
    name: "Birthday & Anniversary Reminder",
    description: "Never forget important dates. Get reminders 3 weeks, 1 week, and 1 day before each occasion.",
    category: "Communication",
    difficulty: "Beginner",
    time: "10 min to customize",
    uses: ["Calendar", "Notification", "Google Contacts"],
    tags: ["reminders", "dates", "communication"],
  },
  {
    id: "6",
    name: "Budget Tracker & Analyzer",
    description: "Track family expenses, categorize spending, and get AI insights on budget trends.",
    category: "Finance & Budget",
    difficulty: "Advanced",
    time: "25 min to customize",
    uses: ["Sheets", "Claude AI", "Banking API", "Charts"],
    tags: ["finance", "analytics", "spending"],
  },
  {
    id: "7",
    name: "Chore Scheduler",
    description: "Assign chores to family members, track completion, and send reminders automatically.",
    category: "Family Organization",
    difficulty: "Intermediate",
    time: "15 min to customize",
    uses: ["Sheets", "Notification", "Assignment Logic"],
    tags: ["chores", "scheduling", "responsibility"],
  },
  {
    id: "8",
    name: "Home Maintenance Tracker",
    description: "Track home maintenance tasks, get seasonal reminders, and maintain a home care calendar.",
    category: "Home & Garden",
    difficulty: "Intermediate",
    time: "20 min to customize",
    uses: ["Calendar", "Sheets", "Notification"],
    tags: ["maintenance", "home", "scheduling"],
  },
  {
    id: "9",
    name: "Study Schedule Planner",
    description: "Create personalized study schedules, generate quiz questions, and track learning progress.",
    category: "Learning & Development",
    difficulty: "Advanced",
    time: "30 min to customize",
    uses: ["Calendar", "Claude AI", "Progress Tracker"],
    tags: ["education", "learning", "planning"],
  },
  {
    id: "10",
    name: "Expense Split Calculator",
    description: "Track shared expenses and automatically calculate who owes whom in group finances.",
    category: "Finance & Budget",
    difficulty: "Intermediate",
    time: "15 min to customize",
    uses: ["Sheets", "Calculator", "Notification"],
    tags: ["finance", "sharing", "calculation"],
  },
  {
    id: "11",
    name: "Plant Watering Reminder",
    description: "Get watering reminders for your indoor plants with care tips based on plant type.",
    category: "Home & Garden",
    difficulty: "Beginner",
    time: "5 min to customize",
    uses: ["Calendar", "Notification", "Plant Database"],
    tags: ["gardening", "plants", "reminders"],
  },
  {
    id: "12",
    name: "Family Event Coordinator",
    description: "Coordinate family events: guest lists, RSVP tracking, menu planning, and task assignment.",
    category: "Family Organization",
    difficulty: "Advanced",
    time: "35 min to customize",
    uses: ["Calendar", "Sheets", "Email", "Claude AI"],
    tags: ["events", "planning", "coordination"],
  },
];

const categories = [
  "All",
  "Family Organization",
  "Finance & Budget",
  "Communication",
  "Home & Garden",
  "Learning & Development",
];

const difficultyColors: Record<string, string> = {
  Beginner: "rgba(34, 211, 238, 0.15)",
  Intermediate: "rgba(168, 85, 247, 0.15)",
  Advanced: "rgba(232, 121, 249, 0.15)",
};

export default function TemplatesPage() {
  return (
    <MarketingPage
      eyebrow="◆ Templates"
      title="Start with templates, finish with something unique"
      subtitle="Ready-made workflows for common family needs. Customize them or use as inspiration for your own."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          {/* Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
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
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {templates.map((template) => (
              <Link
                key={template.id}
                href="#"
                className="card"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                {/* Header with Category */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(168, 85, 247, 0.15)",
                      color: "var(--cyan)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {template.category}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: difficultyColors[template.difficulty],
                      color: "var(--text)",
                      fontWeight: 600,
                    }}
                  >
                    {template.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {template.name}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                  {template.description}
                </p>

                {/* Uses */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Includes:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {template.uses.map((use, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 12,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "rgba(99, 102, 241, 0.1)",
                          color: "var(--indigo)",
                        }}
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    paddingTop: 12,
                    borderTop: "1px solid var(--border)",
                    marginTop: "auto",
                  }}
                >
                  {template.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 11,
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: "transparent",
                        color: "var(--muted)",
                        textTransform: "capitalize",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Time & CTA */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--muted)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon icon="lucide:clock" width={16} height={16} style={{ color: "var(--pink)" }} />
                    <span>{template.time}</span>
                  </div>
                  <div style={{ marginTop: 8, color: "var(--cyan)", fontWeight: 600 }}>Use Template →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Contributed Section */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Community-Built Templates
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            Our community has created hundreds of templates. Browse the most popular, rated, and recently shared.
          </p>
          <Link href="/resources/community" className="btn btn-primary">
            Explore Community Workflows →
          </Link>
        </div>
      </section>

      {/* How to Use CTA */}
      <section className="section" style={{ paddingTop: 24, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="glass" style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              How to Use a Template
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
                { step: "1", title: "Browse", desc: "Find a template that fits your needs" },
                { step: "2", title: "Preview", desc: "See exactly how it's built" },
                { step: "3", title: "Customize", desc: "Adjust for your family" },
                { step: "4", title: "Deploy", desc: "One click to activate" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--cyan)",
                      marginBottom: 8,
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <Link href="/canvas" className="btn btn-primary">
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
