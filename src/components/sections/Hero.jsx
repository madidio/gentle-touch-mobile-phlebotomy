import React from "react";
import { CalendarHeart, ClipboardList, ShieldCheck, Award, Clock, UserCheck } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Award, label: "CPT (ASCP)" },
  { icon: Clock, label: "10+ Years Experience" },
  { icon: UserCheck, label: "Background Checked" }
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex min-h-[600px] flex-col lg:flex-row">
        {/* Left — Image */}
        <div className="relative flex-1 lg:w-1/2">
          <img
            src="https://media.base44.com/images/public/6a4e90e55673f77beb8d6f49/7ae5e88be_Phlebotomytubes.jpg"
            alt="A gloved hand holding a blood collection tube with a rack of other tubes in the background."
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Right — Content */}
        <div className="relative flex-1 bg-white lg:w-1/2">
          <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-20">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              <CalendarHeart className="h-4 w-4 text-primary" />
              Mobile Phlebotomy · Omaha Metro
            </span>

            <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Bringing the Lab to You, One Gentle Draw at a Time.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-lg">
              Compassionate, professional mobile phlebotomy services for the elderly and
              homebound in the Omaha Metro. We come to you, so you never have to wait.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-200 hover:scale-[1.02] hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
              >
                Book Your Appointment Now
              </a>
              <a
                href="/services"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 py-3.5 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <ClipboardList className="h-5 w-5" />
                View Pricing &amp; Services
              </a>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full bg-accent px-5 py-2.5">
                {trustItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        {item.label}
                      </span>
                      {idx < trustItems.length - 1 && (
                        <span className="text-white/40">|</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}