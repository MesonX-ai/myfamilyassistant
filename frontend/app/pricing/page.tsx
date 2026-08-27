import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For getting started with your first family assistants.",
    features: ["3 active workflows", "Community connectors", "Studio canvas", "Email support"],
    cta: "Get started",
    href: "/canvas",
    highlight: false,
  },
  {
    name: "Family",
    price: "$12",
    period: "per month",
    blurb: "For households running assistants across the whole home.",
    features: ["Unlimited workflows", "All connectors", "Shared calendars & lists", "Priority runs", "Priority support"],
    cta: "Start free trial",
    href: "/canvas",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    blurb: "For teams that need control, security, and scale.",
    features: ["SSO & SCIM", "VPC deployment", "Audit logging", "Roles & permissions", "Dedicated support"],
    cta: "Book a demo",
    href: "/about",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingPage
      eyebrow="◆ Pricing"
      title="Simple plans that grow with your household"
      subtitle="Start free, upgrade when your assistants start doing real work. No credit card to explore the canvas."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container">
          <div className="grid-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderColor: t.highlight ? "rgba(124,58,237,0.55)" : undefined,
                  boxShadow: t.highlight ? "0 24px 60px -28px rgba(124,58,237,0.55)" : undefined,
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: 0 }}>{t.name}</h3>
                <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--font-display)" }}>{t.price}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{t.period}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "10px 0 16px" }}>{t.blurb}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {t.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                      <span style={{ color: "var(--cyan)" }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "auto" }}>
                  <Link
                    href={t.href}
                    className={t.highlight ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ width: "100%" }}
                  >
                    {t.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
