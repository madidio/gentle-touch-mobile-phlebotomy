import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "You can book online using our booking form or call us at (402) 212-5964 or (402) 739-9898.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Douglas and Sarpy Counties, including Papillion, Bellevue, La Vista, Gretna, Elkhorn, Bennington, and Ralston.",
  },
  {
    q: "Do you accept insurance?",
    a: "We do not accept Medicare or Medicaid. We accept credit card, HSA, or Venmo.",
  },
  {
    q: "When will I receive my lab results?",
    a: "Gentle Touch provides blood collection and specimen transport services. Laboratory testing and result turnaround times are determined by the laboratory processing your specimens. Please contact your healthcare provider or laboratory for information about your results.",
  },
  {
    q: "Is there a travel fee?",
    a: "A travel fee of $0.725 per mile (2026 IRS standard) applies for round-trip mileage beyond 25 miles from our base location.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made 24 hours in advance incur a $25 fee. Same-day cancellations are non-refundable.",
  },
];

export default function ContactFAQ() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
        <h2 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl bg-white px-6 shadow-gt"
            >
              <AccordionTrigger className="text-left font-heading text-base font-semibold text-primary hover:no-underline">
                {f.q}
              </AccordionTrigger>

              <AccordionContent className="text-sm text-foreground/70 sm:text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}