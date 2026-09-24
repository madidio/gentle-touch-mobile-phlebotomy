import React from "react";
import { CalendarHeart } from "lucide-react";

const AboutHero = ({ headingLevel = "h2" }) => {
  const Heading = headingLevel;
  const isAboutPage = headingLevel === "h1";

  return (
    <section className="w-full bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About Us
            </span>

            <Heading className="font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              About Gentle Touch Mobile Blood Draw
            </Heading>

            <p className="mt-6 text-lg leading-relaxed text-foreground">
              We provide professional and compassionate at-home phlebotomy
              services for elderly, homebound, and other patients who benefit
              from convenient blood collection in the comfort of home.
              Every visit is handled with patience, respect, and clinical
              excellence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/#book"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-300 hover:scale-105 hover:bg-secondary"
              >
                <CalendarHeart className="h-5 w-5" />
                <span>Book an Appointment</span>
              </a>

              {!isAboutPage && (
                <a
                  href="/about"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-primary px-8 py-3.5 text-base font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  Learn More About Us
                </a>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden rounded-xl shadow-gt-lg">
            <img
              src="/images/phlebotomist-drawing-blood-hero.webp"
              alt="Phlebotomist performing a mobile blood draw in a patient's home"
              width="1400"
              height="783"
              className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[500px]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;