import React from "react";
import { Handshake, ClipboardCheck, Clock } from "lucide-react";

const cards = [
  {
    icon: Handshake,
    title: "Help Reduce No-Shows",
    text: "Mobile blood draws can reduce transportation barriers by bringing convenient specimen collection directly to the patient.",
  },
  {
    icon: ClipboardCheck,
    title: "Less Burden on Your Staff",
    text: "We coordinate mobile blood-draw scheduling and specimen collection directly with patients, helping reduce the workload on your clinic staff.",
  },
  {
    icon: Clock,
    title: "Priority Draws Available",
    text: "Priority mobile blood collection is available for time-sensitive lab orders when patients need prompt specimen collection.",
  },
];

export default function ProviderWhy() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h2 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          Why Partner With Gentle Touch
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;

            return (
              <div
                key={c.title}
                className="rounded-xl bg-white p-6 shadow-gt"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>

                <h3 className="mt-4 font-heading text-base font-semibold text-primary">
                  {c.title}
                </h3>

                <p className="mt-2 text-sm text-foreground/60">
                  {c.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}