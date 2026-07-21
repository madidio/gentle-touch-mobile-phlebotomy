import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Kofi was so kind and gentle. My mother has severe anxiety about needles, and he made the experience completely stress-free. We can't thank him enough.",
    author: "Sarah J.",
    location: "Omaha"
  },
  {
    text: "This service is a lifesaver. After my surgery, I couldn't drive. Having Kofi come to my house to draw my blood was so convenient and professional.",
    author: "David M.",
    location: "Papillion"
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            What Our Clients Are Saying
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            Real stories from real people who experienced the Gentle Touch difference.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="relative flex flex-col rounded-xl bg-white p-7 shadow-gt transition-all duration-300 hover:shadow-gt-lg hover:-translate-y-1"
            >
              {/* Quote mark */}
              <Quote className="h-10 w-10 text-accent" fill="currentColor" />

              {/* Star rating */}
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="mt-4 flex-1 text-base leading-relaxed text-primary">
                "{t.text}"
              </p>

              {/* Author */}
              <p className="mt-6 text-sm font-semibold text-primary">
                {t.author}, {t.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}