import React from "react";
import { ShieldCheck, Home, Clock, HeartPulse } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Certified & Experienced",
    text: "Phlebotomist Kofi Gunubu, CPT (ASCP), has over 10 years of experience. Licensed, insured, and fully background-checked. NPI #1669321485."
  },
  {
    icon: Home,
    title: "Convenient & Punctual",
    text: "We come to your home or facility on your schedule. No more stressful travel, waiting rooms, or missed appointments. We respect your time."
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    text: "Results are delivered to your provider within 48 hours. Stat draws are available for urgent needs at $120."
  },
  {
    icon: HeartPulse,
    title: "Compassionate Care",
    text: "We understand the anxiety some patients feel. Our service is built on patience, respect, and a gentle touch. Your comfort is our priority."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Why Families and Providers Choose Gentle Touch
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            We're committed to making lab work convenient, comfortable, and stress-free.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col items-start rounded-xl bg-card p-7 shadow-gt transition-all duration-300 hover:shadow-gt-lg hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/70">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}