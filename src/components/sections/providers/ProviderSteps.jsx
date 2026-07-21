import React from "react";
import { ClipboardList, CalendarCheck, TestTube } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Provider Orders Labs", text: "You order labs through LabCorp, Quest, or your preferred reference lab." },
  { icon: CalendarCheck, title: "Patient Schedules", text: "The patient calls us or books online for an in-home draw at their convenience." },
  { icon: TestTube, title: "We Draw & Transport", text: "We draw, label, and transport the specimen. Results go directly to your EMR." }
];

export default function ProviderSteps() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          How It Works for Providers
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative rounded-xl bg-muted p-6 shadow-gt">
                <span className="absolute right-5 top-4 font-heading text-3xl font-bold text-accent">{i + 1}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
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