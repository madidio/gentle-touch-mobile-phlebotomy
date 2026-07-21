import React from "react";
import { BadgeCheck, FileCheck, ShieldCheck, Lock } from "lucide-react";

const credentials = [
  { icon: BadgeCheck, label: "NPI Number", value: "1669321485" },
  { icon: FileCheck, label: "Liability Insurance", value: "Policy # VK0712" },
  { icon: BadgeCheck, label: "Certifications", value: "CPT (ASCP)" },
  { icon: ShieldCheck, label: "Compliance", value: "OSHA Compliant, HIPAA Compliant" }
];

const badgeItems = [
  "CPT (ASCP)",
  "10+ Years Experience",
  "Licensed & Insured",
  "Background Checked"
];

export default function AboutCredentials() {
  return (
    <section className="w-full bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-white sm:text-3xl">Our Credentials</h3>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <p className="mt-4 text-sm uppercase tracking-wider text-white/60">{c.label}</p>
                <p className="mt-1 font-semibold text-white">{c.value}</p>
              </div>
            );
          })}
        </div>

        {/* Credential badge bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {badgeItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-white"
            >
              <Lock className="h-3.5 w-3.5 text-accent" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}