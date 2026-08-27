import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const resources = [
  {
    t: "Documentation",
    d: "Guides for building, connecting, and running agents on the canvas — from your first node to production scale.",
    href: "#",
  },
  {
    t: "Blog",
    d: "Product updates, family-automation ideas, and stories from people running real workflows at home.",
    href: "#",
  },
  {
    t: "Changelog",
    d: "Every shipped improvement, model addition, and connector — in one timeline you can follow.",
    href: "#",
  },
  {
    t: "Templates",
    d: "Start from a ready-made workflow: meal planner, bill tracker, trip coordinator, and more.",
    href: "#",
  },
  {
    t: "University",
    d: "Self-paced tracks that take you from curious to confident building agentic workflows.",
    href: "#",
  },
  {
    t: "Community",
    d: "Swap workflows, get unstuck, and share what your family assistants automate.",
    href: "#",
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
        <div className="container">
          <div className="grid-2">
            {resources.map((r) => (
              <Link key={r.t} href={r.href} className="card" style={{ textDecoration: "none" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
                  {r.t}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{r.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
