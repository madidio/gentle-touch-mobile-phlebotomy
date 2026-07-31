import React from "react";
import PricingTable from "@/components/sections/services/PricingTable";

export default function Services() {
  return (
    <main className="min-h-screen bg-background">
      {/* Page introduction */}
      <section
        id="services"
        className="scroll-mt-24 bg-primary px-6 py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
            Gentle Touch Mobile Phlebotomy
          </span>

          <h1 className="mt-5 font-heading text-4xl font-bold sm:text-5xl">
            Services &amp; Pricing
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Professional mobile phlebotomy services delivered in the comfort
            and privacy of your home. Our pricing is transparent and
            straightforward, with no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing information */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <PricingTable />
        </div>
      </section>

      {/* Appointment call to action */}
      <section className="bg-accent px-6 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Schedule Your Appointment?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Book a convenient mobile blood-draw appointment in the Omaha Metro
            area.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/#book"
              className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Book an Appointment
            </a>

            <a
              href="/"
              className="inline-flex min-h-[50px] items-center justify-center rounded-xl border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-primary"
            >
              Return Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

