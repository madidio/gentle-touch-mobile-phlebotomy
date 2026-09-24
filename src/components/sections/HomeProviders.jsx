import React from "react";
import { Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeProviders() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="rounded-2xl bg-primary px-6 py-10 text-center shadow-gt-lg sm:px-10 sm:py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
            <Building2 className="h-7 w-7 text-white" />
          </div>

          <h2 className="mt-5 font-heading text-2xl font-bold text-white sm:text-3xl">
            Mobile Phlebotomy for Healthcare Providers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            We partner with healthcare providers throughout the Omaha Metro to
            provide convenient mobile blood collection for patients who benefit
            from in-home or in-facility service.
          </p>

          <Link
            to="/providers"
            className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-gt transition-all duration-200 hover:scale-[1.03]"
          >
            Healthcare Provider Information
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}