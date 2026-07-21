import React from "react";
import { Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProviderCTA() {
  return (
    <section className="w-full bg-primary py-16">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <h3 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
          Become a Partner Today
        </h3>
        <p className="mt-4 text-lg text-white/80">
          Let's make lab work effortless for your patients and your practice.
        </p>
        <Link
          to="/#book"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-gt-lg transition-all hover:scale-[1.03] hover:bg-[#9F8FBC]"
        >
          <Handshake className="h-5 w-5" />
          Become a Partner Today
        </Link>
      </div>
    </section>
  );
}