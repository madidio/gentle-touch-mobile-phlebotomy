import React from "react";
import ServicesList from "@/components/sections/services/ServicesList";
import PricingTable from "@/components/sections/services/PricingTable";
import RefundPolicy from "@/components/sections/services/RefundPolicy";
import PaymentOptions from "@/components/sections/services/PaymentOptions";
import HowItWorksShort from "@/components/sections/services/HowItWorksShort";
import ServiceArea from "@/components/sections/services/ServiceArea";
import ServicesCTA from "@/components/sections/services/ServicesCTA";
import Footer from "@/components/sections/Footer";

export default function Services() {
  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="w-full bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Our Services &amp; Pricing
          </h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
            We offer a full range of professional mobile phlebotomy services in the comfort of
            your home. Our pricing is transparent and straightforward, with no hidden fees.
            Payment is simple and secure through Stripe or Venmo.{" "}
            <span className="font-semibold text-primary">Medicare/Medicaid not accepted.</span>
          </p>
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