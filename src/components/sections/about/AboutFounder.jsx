import React from "react";
import { CalendarHeart, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutFounder() {
  return (
    <section className="w-full bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="flex justify-center">
            <img src="https://media.base44.com/images/public/6a4e90e55673f77beb8d6f49/c19707ca5_new_headshot.jpg"

            alt="Professional headshot of Kofi Gunubu, founder of Gentle Touch Mobile Blood Draw."
            className="h-56 w-56 rounded-full object-cover object-center border-[3px] border-primary shadow-gt-lg sm:h-64 sm:w-64 opacity-100 px-1"
            loading="lazy" />
            
          </div>
          <div>
            <h3 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Meet the Founder</h3>
            <p className="mt-4 text-xl font-semibold text-foreground">Kofi Gunubu, CPT (ASCP)</p>
            <p className="text-base text-accent">Founder &amp; Certified Phlebotomist</p>
            <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">
              Kofi is a dedicated phlebotomist with over 10 years of experience in clinical
              and mobile settings. He has drawn blood for thousands of adult patients and
              understands their unique challenges. His gentle technique, steady hands, and
              warm bedside manner have earned him the trust of patients and healthcare
              providers alike.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Credentials: Master of Public Health (MPH) | CPT (ASCP) | 10+ Years Experience |
              Licensed &amp; Insured | Background Checked
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/#book"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-gt transition-all hover:scale-[1.02] hover:bg-secondary">
                
                <CalendarHeart className="h-5 w-5" /> Book an Appointment
              </Link>
              <Link
                to="/#contact"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-3 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-white">
                
                <Mail className="h-5 w-5" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}