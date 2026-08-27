import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { VisualAgentBuilder } from "@/components/landing/VisualAgentBuilder";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Showcase } from "@/components/landing/Showcase";
import { Stats } from "@/components/landing/Stats";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Page() {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <LogoCloud />
      <VisualAgentBuilder />
      <Features />
      <Showcase />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}
