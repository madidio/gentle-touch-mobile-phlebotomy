import React from "react";
import { ExternalLink, Star } from "lucide-react";

const GOOGLE_REVIEW_URL =
  "https://g.page/r/CUN01PWWCME2EBM/review";

export default function Testimonials() {
  return (
    <section className="w-full bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex justify-center gap-1" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 text-secondary"
                fill="currentColor"
              />
            ))}
          </div>

          <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Share Your Experience
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/70">
            Have you used Gentle Touch Mobile Blood Draw? We&apos;d appreciate
            hearing about your experience. Your feedback helps other Omaha-area
            patients learn more about our mobile blood draw service.
          </p>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Leave Us a Google Review
            <ExternalLink className="h-4 w-4" />
          </a>

          <p className="mt-4 text-sm text-foreground/60">
            Thank you for supporting our local Omaha mobile phlebotomy service.
          </p>
        </div>
      </div>
    </section>
  );
}