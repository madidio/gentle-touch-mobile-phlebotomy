import React from "react";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactDetails from "@/components/sections/contact/ContactDetails";
import ContactFAQ from "@/components/sections/contact/ContactFAQ";
import ContactTrustBadges from "@/components/sections/contact/ContactTrustBadges";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

export default function Contact() {
  return (
    <main className="w-full bg-white">
      <PageMeta
        title="Contact & Book a Mobile Blood Draw in Omaha"
        description="Contact Gentle Touch Mobile Blood Draw to ask questions or schedule professional mobile phlebotomy services in Omaha and surrounding Nebraska communities."
        path="/contact"
      />

      <section className="w-full bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Contact Gentle Touch Mobile Blood Draw
          </h1>

          <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
            We're here to help. Reach out with any questions or to schedule your appointment.
          </p>
        </div>
      </section>

      <section className="w-full bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <ContactForm />
            <ContactDetails />
          </div>
        </div>
      </section>

      <ContactTrustBadges />
      <ContactFAQ />
      <Footer />
    </main>
  );
}