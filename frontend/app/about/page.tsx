import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const values = [
  {
    t: "Families first",
    d: "We measure success by how much time and peace of mind we give real households.",
  },
  {
    t: "Privacy by default",
    d: "We build as if our own families' data were on the line — because it is.",
  },
  {
    t: "Craft over scale",
    d: "Small, durable details beat flashy demos. We sweat the boring parts.",
  },
  {
    t: "Own the outcome",
    d: "Short loops, real impact. We ship and see our work making daily life easier.",
  },
];

const stats = [
  { v: "0", l: "Glue code required" },
  { v: "100%", l: "Visual, from idea to running agent" },
  { v: "24/7", l: "Family-friendly by design" },
];

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="◆ About"
      title="We're giving families their time back"
      subtitle="MyFamilyAssistant is a visual agentic workflow platform. We help people design, connect, and run AI assistants on a living canvas — no glue code required."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container">
          <div className="grid-2" style={{ marginBottom: 48 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: 28, margin: "0 0 14px" }}>
                Our story
              </h2>
              <p className="section-sub" style={{ margin: 0 }}>
                We started with a simple frustration: running an AI assistant
                for your family or small team shouldn't require a software
                engineering degree. So we built a canvas where you wire together
                the pieces — a trigger, an agent, an output — and see them come
                alive as a running workflow.
              </p>
              <p className="section-sub" style={{ margin: "16px 0 0" }}>
                Today the platform turns visual node-and-wire layouts into
                reliable, reactive agents that handle tasks around the home and
                office, quietly and securely in the background.
              </p>
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: 28, margin: "0 0 14px" }}>
                Our mission
              </h2>
              <p className="section-sub" style={{ margin: 0 }}>
                Give every family the ability to build the personal assistant
                they actually want — one that respects their privacy, stays under
                their control, and grows with them. No vendor lock-in, no
                fireworks. Just agents that work.
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ marginBottom: 48 }}>
            {stats.map((s) => (
              <div key={s.l} className="card" style={{ textAlign: "center" }}>
                <div className="stat-value gradient-text">{s.v}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-title" style={{ fontSize: 28, margin: "0 0 20px" }}>
            What we value
          </h2>
          <div className="grid-2">
            {values.map((v) => (
              <div key={v.t} className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>
                  {v.t}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{v.d}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/canvas" className="btn btn-primary">
              Open the Studio →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}