import React from "react";
import { AlertTriangle, Accessibility, CalendarX, Smile } from "lucide-react";

const problems = [
  { icon: AlertTriangle, text: "Missed labs due to transportation or illness." },
  { icon: Accessibility, text: "Elderly, disabled, or anxious patients who cannot travel." },
  { icon: CalendarX, text: "No-shows that delay diagnosis and treatment." },
  { icon: Smile, text: "Increased patient satisfaction and reduced barriers to care." }
];

export default function ProviderProblem() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          The Problem We Solve
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.text} className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-gt">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-base text-foreground/80">{p.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}