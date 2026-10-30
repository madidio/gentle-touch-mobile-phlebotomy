
import React from "react";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you request an appointment through our website, we collect your name, phone number, email address, and appointment details, such as your preferred date, time, or location.",
      "Our website booking form does not request diagnoses, medications, medical histories, or laboratory test results. Please avoid entering sensitive medical information in appointment request fields.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "We use the information you provide to respond to appointment requests, communicate about scheduling, coordinate mobile blood draw services, answer inquiries, maintain appropriate business records, and support website security.",
      "We do not sell personal information collected through our appointment form.",
    ],
  },
  {
    title: "3. Information Sharing",
    paragraphs: [
      "We may share information with website hosting and appointment-form providers, authorized service providers, healthcare providers or laboratories when appropriate for coordinating services, or authorities when required by law.",
      "We do not share appointment information with third parties for their independent marketing purposes without appropriate authorization.",
    ],
  },
  {
    title: "4. Website Hosting and Appointment Forms",
    paragraphs: [
      "Our website uses third-party services to host website content and process appointment submissions. These providers may process information necessary to deliver their services, subject to their applicable terms and privacy practices.",
    ],
  },
  {
    title: "5. Cookies and Technical Information",
    paragraphs: [
      "Our website or its hosting providers may process technical information such as IP addresses, browser details, and essential cookies for website operation, security, and troubleshooting.",
      "If we introduce additional analytics, advertising cookies, or tracking services, we will update this policy as appropriate.",
    ],
  },
  {
    title: "6. Information Security",
    paragraphs: [
      "We take reasonable measures to protect personal information against unauthorized access, use, or disclosure. However, no internet transmission or electronic storage system is completely secure.",
    ],
  },
  {
    title: "7. Information Retention",
    paragraphs: [
      "We retain personal information as long as reasonably necessary for scheduling, providing services, maintaining records, resolving disputes, and meeting applicable legal requirements.",
    ],
  },
  {
    title: "8. Your Privacy Choices",
    paragraphs: [
      "You may contact us to request information about personal data you submitted through our website, or to request correction or deletion, subject to applicable legal and recordkeeping requirements.",
    ],
  },
  {
    title: "9. Healthcare Privacy",
    paragraphs: [
      "Gentle Touch may handle additional patient information when providing healthcare-related services outside the website booking form.",
      "Protected health information subject to HIPAA or other applicable healthcare privacy laws must be handled according to those requirements. This website Privacy Policy does not replace a HIPAA Notice of Privacy Practices where one is legally required.",
    ],
  },
  {
    title: "10. Children's Privacy",
    paragraphs: [
      "Our website is not intended for children to independently submit personal information. Parents or legal guardians should handle appointment requests for minors.",
    ],
  },
  {
    title: "11. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy to reflect changes in our services, website practices, or legal requirements. Updates will be posted here with a revised effective date.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <PageMeta
        title="Privacy Policy | Gentle Touch Mobile Blood Draw"
        description="Learn how Gentle Touch Mobile Blood Draw, LLC collects, uses, and protects personal information submitted through our website."
        path="/privacy-policy"
      />

      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10 lg:py-20">
          <header className="mb-10">
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Privacy Policy
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
              Gentle Touch Mobile Blood Draw, LLC ("Gentle Touch",
              "we", "us", or "our") respects your privacy.
              This policy explains how we collect, use, share,
              and safeguard information submitted through our website.
            </p>

            {sections.map((section) => (
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
                12. Contact Us
              </h2>

              <p>
                For questions about this Privacy Policy or your
                personal information, please contact:
              </p>

              <address className="mt-4 space-y-2 not-italic">
                <p className="font-semibold">
                  Gentle Touch Mobile Blood Draw, LLC
                </p>
                <p>Omaha, Nebraska</p>
                <p>
                  Phone:{" "}
                  <a
                    href="tel:+14022125964"
                    className="text-primary underline"
                  >
                    (402) 212-5964
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
