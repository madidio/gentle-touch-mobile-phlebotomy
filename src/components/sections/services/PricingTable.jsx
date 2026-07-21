import React from "react";

const rows = [
  { service: "Standard Draw (Within 25 miles)", price: "$80.00", details: "Routine lab work. Results within 48 hours." },
  { service: "Stat Draw (Within 25 miles)", price: "$120.00", details: "Urgent lab needs. Expedited processing." },
  { service: "Fasting Draw (Within 25 miles)", price: "$80.00", details: "Early morning appointments available." },
  { service: "Travel Fee (Beyond 25 miles)", price: "$0.725/mile", details: "Applied to round-trip mileage. Rate based on 2026 IRS standard." }
];

export default function PricingTable() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl shadow-gt sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent/30">
                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Service</th>
                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Price</th>
                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.service} className={i % 2 === 0 ? "bg-white" : "bg-muted"}>
                  <td className="px-6 py-4 font-medium text-foreground">{r.service}</td>
                  <td className="px-6 py-4 font-semibold text-secondary">{r.price}</td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{r.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 sm:hidden">
          {rows.map((r) => (
            <div key={r.service} className="rounded-xl bg-white p-5 shadow-gt">
              <p className="font-medium text-foreground">{r.service}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-secondary">{r.price}</p>
              <p className="mt-2 text-sm text-foreground/60">{r.details}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-foreground/50">
          Medicare/Medicaid not accepted. Card or HSA only. Prices subject to change.
          Contact us for special scheduling needs.
        </p>
      </div>
    </section>
  );
}