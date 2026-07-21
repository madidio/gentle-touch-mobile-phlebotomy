import React from "react";
import { AlertCircle } from "lucide-react";

const policies = [
  "Cancellations made 24 hours in advance will incur a $25 cancellation fee.",
  "Same-day cancellations are non-refundable.",
  "We appreciate your understanding and cooperation."
];

export default function RefundPolicy() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="rounded-xl bg-accent/20 p-8 shadow-gt sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15">
              <AlertCircle className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-primary sm:text-2xl">
              Cancellation &amp; Refund Policy
            </h3>
          </div>
          <p className="mt-4 text-sm text-foreground/60 sm:text-base">
            We understand that schedules change. Please review our policy below.
          </p>
          <ul className="mt-6 space-y-3">
            {policies.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <span className="text-sm text-foreground/80 sm:text-base">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}