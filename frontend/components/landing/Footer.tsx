import Link from "next/link";

const cols = [
  {
    h: "Product",
    links: ["Studio", "Integrations", "Pricing", "Changelog"],
  },
  {
    h: "Developers",
    links: ["Docs", "API Reference", "Status", "GitHub"],
  },
  {
    h: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand" style={{ fontSize: 19 }}>
            <img src="/logo.png" alt="MyFamilyAssistant.ai" style={{ height: 30, width: "auto", display: "block", borderRadius: 6 }} />
            MyFamilyAssistant<span className="brand-dot">.ai</span>
          </Link>
          <p style={{ maxWidth: 280, fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>
            The visual agentic workflow platform. Design, connect, and run AI agents on a living canvas.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4>{c.h}</h4>
            {c.links.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        className="container"
        style={{
          marginTop: 40,
          paddingTop: 22,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 13,
        }}
      >
        <span>© {new Date().getFullYear()} MyFamilyAssistant.ai. All rights reserved.</span>
        <span style={{ display: "flex", gap: 20 }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </span>
      </div>
    </footer>
  );
}
