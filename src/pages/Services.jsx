import React from "react";
import ServicesList from "@/components/sections/services/ServicesList";
import PricingTable from "@/components/sections/services/PricingTable";
import RefundPolicy from "@/components/sections/services/RefundPolicy";
import PaymentOptions from "@/components/sections/services/PaymentOptions";
import HowItWorksShort from "@/components/sections/services/HowItWorksShort";
import ServiceArea from "@/components/sections/services/ServiceArea";
import ServicesCTA from "@/components/sections/services/ServicesCTA";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

export default function Services() {
  return (
    <main className="w-full bg-white">
      <PageMeta
        title="Mobile Blood Draw Services & Pricing in Omaha"
        description="Request an at-home blood draw in Omaha and nearby communities in Douglas and Sarpy counties. Standard visits are $80 before any additional travel fees."
        path="/services"
      />

      <section className="w-full bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            At-Home Blood Draws in Omaha, NE
          </h1>

          <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
            Gentle Touch comes to your home in Omaha and nearby communities in
            Douglas and Sarpy counties to collect blood samples for lab work ordered
            by your healthcare provider. A standard blood draw is $80 and includes
            the first 25 one-way driving miles from our Omaha business location.
            Additional miles are $0.75 each. You can pay by Stripe or Venmo.{" "}
            <span className="font-semibold text-primary">
              Medicare/Medicaid not accepted.
            </span>
          </p>

          <a
            href="/#book"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Request an Appointment
          </a>
        </div>
      </section>

      <ServicesList />
      <PricingTable />
      <RefundPolicy />
      <PaymentOptions />
      <HowItWorksShort />
      <ServiceArea />
      <ServicesCTA />
      <Footer />
    </main>
  );
}