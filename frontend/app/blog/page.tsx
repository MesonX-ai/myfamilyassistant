import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const posts = [
  {
    title: "Your first agent in five minutes",
    excerpt:
      "A trigger, a model, an output — see how ordinary fixes turn into a working agent without writing glue code.",
    date: "Aug 18, 2026",
    tag: "Guides",
  },
  {
    title: "What a living canvas means for agent building",
    excerpt:
      "Why wiring workflows visually beats hand-written graphs for debugging, iteration, and family-friendly craft.",
    date: "Aug 4, 2026",
    tag: "Product",
  },
  {
    title: "Privacy by default: who can see your workflows",
    excerpt:
      "An honest look at where workflow data lives, who has access, and the controls we put in your hands.",
    date: "Jul 21, 2026",
    tag: "Trust",
  },
];

export default function BlogPage() {
  return (
    <MarketingPage
      eyebrow="◆ Blog"
      title="Notes from the studio"
      subtitle="Guides, product updates, and honest perspectives on building agents that work for real families."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {posts.map((p) => (
              <Link
                key={p.title}
                href="#"
                className="card"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    color: "var(--muted)",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      color: "var(--cyan)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span>·</span>
                  <span>{p.date}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {p.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}