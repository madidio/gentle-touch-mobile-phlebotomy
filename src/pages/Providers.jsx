import React from "react";
import ProviderProblem from "@/components/sections/providers/ProviderProblem";
import ProviderSteps from "@/components/sections/providers/ProviderSteps";
import ProviderWhy from "@/components/sections/providers/ProviderWhy";
import ProviderRefer from "@/components/sections/providers/ProviderRefer";
import ProviderContact from "@/components/sections/providers/ProviderContact";
import ProviderCTA from "@/components/sections/providers/ProviderCTA";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

export default function Providers() {
  return (
    <main className="w-full bg-muted">
      <PageMeta
        title="Mobile Phlebotomy for Healthcare Providers in Omaha"
        description="Partner with Gentle Touch Mobile Blood Draw for professional mobile phlebotomy services for patients in Omaha, Douglas County, Sarpy County, and surrounding communities."
        path="/providers"
      />

      <section className="w-full bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Mobile Phlebotomy for Omaha Healthcare Providers
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