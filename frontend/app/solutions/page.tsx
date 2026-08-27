import Link from "next/link";
import { MarketingPage } from "@/components/landing/MarketingPage";

const solutions = [
  {
    t: "Household Ops",
    d: "Coordinate chores, bills, and shared calendars across the whole home. The assistant keeps everyone aligned without the group-chat chaos.",
  },
  {
    t: "Meal Planning",
    d: "Build weekly menus from dietary needs and what's already in the fridge, then turn them into a shopping list and a one-tap order.",
  },
  {
    t: "Calendar & Reminders",
    d: "Natural-language scheduling that resolves conflicts, sends gentle nudges, and never lets a birthday or pickup slip through.",
  },
  {
    t: "Family Finance",
    d: "Track allowances, split shared expenses, and surface unusual charges — with guardrails so kids learn healthy money habits.",
  },
  {
    t: "Childcare Coordination",
    d: "Sync sitters, activities, and school runs. The assistant drafts the plan and you approve it in a tap.",
  },
  {
    t: "Elder Care",
    d: "Medication reminders, appointment logistics, and check-in summaries for aging loved ones — private and human-in-the-loop.",
  },
  {
    t: "Travel Planning",
    d: "From itineraries to packing lists to rebooking when flights slip, the assistant handles the moving parts of family trips.",
  },
  {
    t: "Shopping & Errands",
    d: "Compare prices, reorder staples, and route deliveries — all from a single conversational request.",
  },
  {
    t: "Pet Care",
    d: "Feeding schedules, vet visits, and supply refreshes, coordinated so nothing about the family's companions is forgotten.",
  },
];

export default function SolutionsPage() {
  return (
    <MarketingPage
      eyebrow="◆ Solutions"
      title="AI assistants for every corner of family life"
      subtitle="Pick a starting point or compose your own. Each solution is a living workflow you can wire, tweak, and run on the Studio canvas."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container">
          <div className="grid-3">
            {solutions.map((s) => (
              <div key={s.t} className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>
                  {s.t}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/canvas" className="btn btn-primary">
              Open the Studio →
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
