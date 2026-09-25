import React from "react";

const rows = [
  {
    service: "Standard Draw (Within 25 miles)",
    price: "$80.00",
    details: "Mobile blood collection for routine laboratory orders.",
  },
  {
    service: "Stat Draw (Within 25 miles)",
    price: "$120.00",
    details: "Priority mobile blood collection for time-sensitive lab orders.",
  },
  {
    service: "Fasting Draw (Within 25 miles)",
    price: "$80.00",
    details: "Early-morning mobile appointments for fasting lab orders.",
  },
  {
    service: "Travel Fee (Beyond 25 miles)",
    price: "$0.725/mile",
    details: "Applied to round-trip mileage beyond 25 miles.",
  },
];

export default function PricingTable() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
            Mobile Blood Draw Pricing
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-lg">
            Transparent pricing for mobile blood collection throughout the
            Omaha Metro.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl shadow-gt sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent/30">
                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  Service
                </th>

                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  Price
                </th>

                <th className="px-6 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.service}
                  className={index % 2 === 0 ? "bg-white" : "bg-muted"}
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {row.service}
                  </td>

                  <td className="px-6 py-4 font-semibold text-secondary">
                    {row.price}
                  </td>

                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {row.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 sm:hidden">
          {rows.map((row) => (
            <div
              key={row.service}
              className="rounded-xl bg-white p-5 shadow-gt"
            >
              <h3 className="font-heading text-base font-semibold text-primary">
                {row.service}
              </h3>

              <p className="mt-1 font-heading text-xl font-semibold text-secondary">
                {row.price}
              </p>

              <p className="mt-2 text-sm text-foreground/60">
                {row.details}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-foreground/50">
          Medicare/Medicaid not accepted. Card or HSA only. Prices subject to
          change. Contact us for special scheduling needs.
        </p>
      </div>
    </section>
  );
}