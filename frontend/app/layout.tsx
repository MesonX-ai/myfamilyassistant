import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "MyFamilyAssistant.ai — Visual Agentic Workflow Platform",
  description:
    "Design, connect, and run AI agent workflows on a living canvas. MyFamilyAssistant.ai turns ideas into running LangGraph agents — no glue code required.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
