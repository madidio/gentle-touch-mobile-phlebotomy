import React from "react";
import ProviderProblem from "@/components/sections/providers/ProviderProblem";
import ProviderSteps from "@/components/sections/providers/ProviderSteps";
import ProviderWhy from "@/components/sections/providers/ProviderWhy";
import ProviderRefer from "@/components/sections/providers/ProviderRefer";
import ProviderContact from "@/components/sections/providers/ProviderContact";
import ProviderCTA from "@/components/sections/providers/ProviderCTA";
import Footer from "@/components/sections/Footer";

export default function Providers() {
  return (
    <main className="w-full bg-muted">
      {/* Header */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            For Healthcare Providers: Partner with Gentle Touch
          </h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
            We are your trusted partner in patient care. We make lab work easier for your
            patients and your practice. No training, scheduling, or billing headaches for
            your staff.
          </p>
        </div>
      </section>

      <ProviderProblem />
      <ProviderSteps />
      <ProviderWhy />
      <ProviderRefer />
      <ProviderContact />
      <ProviderCTA />
      <Footer />
    </main>
  );
}