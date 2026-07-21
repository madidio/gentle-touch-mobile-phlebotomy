import React from "react";
import { ClipboardList, CalendarCheck, TestTube, BadgeCheck } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Provider Orders Labs", text: "Your healthcare provider orders your lab work." },
  { icon: CalendarCheck, title: "You Schedule with Us", text: "Book a convenient time for your at-home draw." },
  { icon: TestTube, title: "We Draw & Transport", text: "We collect samples and transport them safely." },
  { icon: BadgeCheck, title: "You Pay Securely", text: "Pay easily via Stripe or Venmo." }
];

export default function HowItWorksShort() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative rounded-xl bg-white p-6 text-center shadow-gt">
                <span className="absolute right-4 top-4 font-heading text-2xl font-bold text-accent">{i + 1}</span>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="mt-4 font-heading text-base font-semibold text-primary">{s.title}</h4>
                <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}