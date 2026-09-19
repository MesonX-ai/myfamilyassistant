import Link from "next/link";

const cols: { h: string; links: [string, string][] }[] = [
  {
    h: "Product",
    links: [
      ["Solutions", "/solutions"],
      ["Resources", "/resources"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    h: "Developers",
    links: [
      ["Docs", "#"],
      ["API Reference", "#"],
      ["Status", "#"],
      ["GitHub", "#"],
    ],
  },
  {
    h: "Company",
    links: [
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Contact", "#"],
      ["Security", "#"],
    ],
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
            {c.links.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
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
        <span>
          © {new Date().getFullYear()}{" "}
          <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>
            Mesonsoft LLC
          </Link>{" "}
          — creators of MyFamilyAssistant.ai and the MesonX agent platform.
        </span>
        <span style={{ display: "flex", gap: 20 }}>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/security">Security</Link>
        </span>
      </div>
      {/* Brand & founder attribution — SEO signal for target keywords. */}
      <div
        className="container"
        style={{
          marginTop: 18,
          paddingBottom: 24,
          fontSize: 12,
          color: "var(--muted)",
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0 }}>
          Built by{" "}
          <Link
            href="/about"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Shiva Dhanuskodi (AniShiv)
          </Link>{" "}
          — founder of Mesonsoft LLC. MyFamilyAssistant.ai runs on the{" "}
          <a
            href="https://mesonx.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            MesonX
          </a>{" "}
          agent runtime.
        </p>
      </div>
    </footer>
  );
}
