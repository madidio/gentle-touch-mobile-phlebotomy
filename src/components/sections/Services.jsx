import React from "react";
import { Droplet, Zap, Moon, Heart, CalendarHeart, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Droplet,
    title: "Standard Blood Draw",
    description: "Routine lab work drawn in the comfort of your home. Results within 48 hours.",
    price: "$80",
    cta: "Book Now",
    href: "/contact"
  },
  {
    icon: Zap,
    title: "Stat Blood Draw",
    description: "Urgent lab needs requiring expedited processing and delivery.",
    price: "$120",
    cta: "Book Stat Draw",
    href: "/contact"
  },
  {
    icon: Moon,
    title: "Fasting Blood Draw",
    description: "Early morning appointments for fasting labs. We work around your schedule.",
    price: "$80",
    cta: "Book Now",
    href: "/contact"
  },
  {
    icon: Heart,
    title: "Geriatric Phlebotomy",
    description: "Specialized care for elderly patients with fragile veins or anxiety. Our gentle approach makes all the difference.",
    price: "$80",
    cta: "Book Now",
    href: "/contact"
  },
  {
    icon: CalendarHeart,
    title: "Custom Scheduling",
    description: "Need a specific time or have special requirements? We'll work with you to accommodate.",
    price: "Flexible",
    cta: "Contact Us",
    href: "/contact"
  }
];

export default function Services() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
            Comprehensive mobile phlebotomy services tailored to your needs.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex flex-col rounded-xl bg-white p-7 shadow-gt transition-all duration-200 hover:shadow-gt-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
                    {s.price}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-lg font-semibold text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">
                  {s.description}
                </p>

                <a
                  href={s.href}
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center text-sm italic text-foreground/60">
          *Medicare/Medicaid not accepted. Card or HSA only. Cancellation policy applies.
          See our{" "}
          <a href="/services" className="font-semibold text-primary underline hover:text-secondary">
            Services &amp; Pricing page
          </a>{" "}
          for details.
        </p>
      </div>
    </section>
  );
}