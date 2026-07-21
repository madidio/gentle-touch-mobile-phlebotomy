import React from "react";
import { Handshake, ClipboardCheck, Rocket } from "lucide-react";

const cards = [
  { icon: Handshake, title: "Reduce No-Shows", text: "We go to the patient. Eliminate transportation barriers and missed appointments." },
  { icon: ClipboardCheck, title: "Zero Burden on Your Staff", text: "No training, scheduling, or billing for your clinic. We handle everything." },
  { icon: Rocket, title: "Fast Turnaround", text: "Results within 48 hours (stat available). Expedite diagnosis and treatment." }
];

export default function ProviderWhy() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          Why Partner With Us
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-xl bg-white p-6 shadow-gt">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="mt-4 font-heading text-base font-semibold text-primary">{c.title}</h4>
                <p className="mt-2 text-sm text-foreground/60">{c.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}