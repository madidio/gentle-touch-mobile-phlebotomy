import {SAME_DAY_RESCHEDULE} from "../../shared/cancellation-policy.mjs";

import React from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

const sections = [
  {
    title: "1. Services",
    paragraphs: [
      "Gentle Touch Mobile Blood Draw, LLC provides mobile blood collection services in Omaha, Nebraska, and surrounding service areas.",
      "Services are subject to availability, applicable professional requirements, and any necessary laboratory orders or collection instructions.",
      "Gentle Touch does not independently diagnose medical conditions, prescribe treatment, or interpret laboratory results.",
    ],
  },
  {
    title: "2. Appointment Scheduling",
    paragraphs: [
      "Clients must provide accurate contact information and appointment details when requesting services.",
      "Submitting an appointment request does not guarantee an appointment until it has been confirmed by Gentle Touch.",
      "We may contact clients to verify scheduling information, service requirements, and availability.",
    ],
  },
  {
    title: "3. Payment Policy",
    paragraphs: [
      "Payment is required before the blood draw is performed.",
      "Applicable service fees will be communicated to the client before payment.",
      "Unless expressly stated otherwise, Gentle Touch's collection fees are separate from charges assessed by third-party laboratories or healthcare providers.",
    ],
  },
  {
    title: "5. Client Responsibilities",
    paragraphs: [
      "Clients agree to provide accurate scheduling information, be available at the confirmed appointment location, and follow applicable collection preparation instructions provided by their healthcare provider or laboratory.",
      "Clients should notify Gentle Touch of circumstances that may affect the safety or feasibility of the collection.",
    ],
  },
  {
    title: "6. Laboratory Orders and Test Results",
    paragraphs: [
      "When required, clients are responsible for ensuring that valid laboratory orders and relevant collection instructions are available.",
      "Laboratory testing, processing, and reporting may be performed by independent laboratories or healthcare providers.",
      "Gentle Touch does not guarantee laboratory turnaround times or specific test results.",
    ],
  },
  {
    title: "7. Service Availability and Safety",
    paragraphs: [
      "We may need to reschedule or decline a collection because of safety concerns, unavailable collection requirements, severe weather, or other circumstances that prevent appropriate service delivery.",
      "Any applicable refund or rescheduling arrangement will be communicated to the client in accordance with the circumstances and applicable law.",
    ],
  },
  {
    title: "8. Website Use",
    paragraphs: [
      "Visitors agree to use our website lawfully and not interfere with its security, availability, or functionality.",
      "Information on this website is provided for general service and scheduling purposes and is not a substitute for professional medical advice.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, Gentle Touch is not responsible for disruptions caused by independent laboratories, third-party systems, or circumstances outside our reasonable control.",
      "Nothing in these Terms excludes rights or responsibilities that cannot legally be limited.",
    ],
  },
  {
    title: "11. Changes to These Terms",
    paragraphs: [
      "We may update these Terms of Service when our services, business policies, or legal requirements change.",
      "The current version will be published on this page with its effective date.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <>
      <PageMeta
        title="Terms of Service | Gentle Touch Mobile Blood Draw"
        description="Review appointment scheduling, payment, cancellation, refund, and service terms for Gentle Touch Mobile Blood Draw."
        path="/terms-of-service"
      />

      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10 lg:py-20">
          <header className="mb-10">
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Terms of Service
            </h1>

            <p className="mt-3 text-base font-semibold text-foreground">
              Gentle Touch Mobile Blood Draw, LLC
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Effective Date: October 30, 2026
            </p>
          </header>

          <div className="space-y-8 text-base leading-relaxed text-foreground">
            <p>
              Welcome to Gentle Touch Mobile Blood Draw, LLC.
              By using our website or scheduling our mobile
              phlebotomy services, you agree to these Terms of Service.
            </p>

            {sections.slice(0, 3).map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                4. Cancellation and Refund Policy
              </h2>

              <p className="mb-4">
                We understand that schedules change.
                Please review our cancellation and refund policy:
              </p>

              <ul className="list-disc space-y-3 pl-6">
                <li>
                  <strong>Cancellations before the appointment day:</strong>{" "}
                  Clients receive a refund of their payment minus
                  a $25 cancellation fee.
                </li>
                <li>
                  <strong>Same-day cancellations:</strong>{" "}
                  Cancellations made on the scheduled appointment
                  date are non-refundable.
                </li>
                <li>
                  <strong>One-time same-day reschedule:</strong>{" "}
                  {SAME_DAY_RESCHEDULE}
                </li>
                <li>
                  <strong>Refund processing:</strong>{" "}
                  Eligible refunds are processed through the
                  applicable payment method, subject to
                  payment-provider processing times.
                </li>
              </ul>

              <p className="mt-4">
                These provisions are subject to applicable law.
              </p>
            </section>

            {sections.slice(3, 7).map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                9. Privacy
              </h2>
              <p>
                Our handling of personal information submitted
                through the website is described in our{" "}
                <Link
                  to="/privacy-policy"
                  className="text-primary underline"
                >
                  Privacy Policy
                </Link>.
              </p>
            </section>

            {sections.slice(7).map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl">
                12. Contact Information
              </h2>

              <address className="space-y-2 not-italic">
                <p className="font-semibold">
                  Gentle Touch Mobile Blood Draw, LLC
                </p>
                <p>Omaha, Nebraska</p>
                <p>
                  Primary:{" "}
                  <a href="tel:+14022125964" className="text-primary underline">
                    (402) 212-5964
                  </a>
                </p>
                <p>
                  Alternate:{" "}
                  <a href="tel:+14027399898" className="text-primary underline">
                    (402) 739-9898
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:gentletouchlabs27@gmail.com"
                    className="break-all text-primary underline"
                  >
                    gentletouchlabs27@gmail.com
                  </a>
                </p>
              </address>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
