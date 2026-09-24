import React from "react";
import {
  FileText,
  CalendarCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "1",
    icon: FileText,
    title: "Provider Orders Labs",
    text: "Your doctor or healthcare provider orders the laboratory testing you need.",
  },
  {
    number: "2",
    icon: CalendarCheck,
    title: "Schedule Your Draw",
    text: "Book online or call us at (402) 212-5964 to schedule your convenient in-home or in-facility blood draw.",
  },
  {
    number: "3",
    icon: Stethoscope,
    title: "We Collect & Transport",
    text: "A certified phlebotomist arrives, performs your blood draw with care, properly labels the specimens, and handles transport according to the applicable lab requirements.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            How Mobile Blood Draws Work
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            From your provider's lab order to convenient specimen collection,
            we make the mobile blood draw process simple.
          </p>
        </div>

        {/* 3-step layout */}
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-border md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-gt">
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {step.number}
                  </span>

                  <Icon className="h-9 w-9" />
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold text-primary">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-base leading-relaxed text-foreground/70">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href="/#book"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-200 hover:scale-[1.03] hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            Book Your Appointment Now
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}