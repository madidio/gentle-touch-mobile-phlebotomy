import React from "react";
import { ShieldCheck, HardHat, BadgeCheck } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "HIPAA Compliant" },
  { icon: HardHat, label: "OSHA Compliant" },
  { icon: BadgeCheck, label: "Licensed & Insured" }
];

export default function ContactTrustBadges() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6 sm:gap-12">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label} className="flex items-center gap-2.5">
              <Icon className="h-7 w-7 text-secondary" />
              <span className="font-heading text-sm font-semibold text-primary sm:text-base">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}