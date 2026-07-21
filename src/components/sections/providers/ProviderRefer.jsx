import React from "react";
import { CreditCard, MessageSquare, Building2 } from "lucide-react";

const options = [
  { icon: CreditCard, title: "Hand Out Our Card", text: "Give the patient our business card so they can reach us directly." },
  {
    icon: MessageSquare,
    title: "Front Desk Script",
    text: "\"If getting to a lab is hard, call Gentle Touch Blood Draw at 402-212-5964. They come to you.\""
  },
  { icon: Building2, title: "Dedicated Fax / Portal", text: "A dedicated fax or portal is available for high-volume referrers." }
];

export default function ProviderRefer() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          How to Refer Patients
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.title} className="rounded-xl bg-muted p-6 shadow-gt">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="mt-4 font-heading text-base font-semibold text-primary">{o.title}</h4>
                <p className="mt-2 text-sm text-foreground/60">{o.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <a
            href="mailto:gentletouchlabs27@gmail.com?subject=Provider%20Partnership%20Inquiry"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-secondary px-7 py-3 text-base font-semibold text-white shadow-gt-lg transition-all hover:scale-[1.02] hover:bg-primary"
          >
            Request Info
          </a>
        </div>
      </div>
    </section>
  );
}