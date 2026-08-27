import { AnimatedBackground } from "./AnimatedBackground";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface MarketingPageProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function MarketingPage({ eyebrow, title, subtitle, children }: MarketingPageProps) {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <AnimatedBackground />
      <Navbar />
      <section className="section" style={{ paddingTop: 104, paddingBottom: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          {eyebrow && (
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              {eyebrow}
            </div>
          )}
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", margin: "12px 0 14px" }}
          >
            {title}
          </h1>
          {subtitle && <p className="section-sub" style={{ margin: "0 auto" }}>{subtitle}</p>}
        </div>
      </section>
      {children}
      <Footer />
    </main>
  );
}
