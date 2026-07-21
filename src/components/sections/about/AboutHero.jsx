import React from "react";
import { CalendarHeart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <section className="w-full bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About Us
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              About Gentle Touch Mobile Blood Draw
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground">
              To provide professional and compassionate at-home phlebotomy services to the
              elderly and homebound, ensuring their essential lab work is completed with
              patience, respect, and clinical excellence.
            </p>
            <div className="mt-8">
              <Link
                to="/#book"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all hover:scale-[1.03] hover:bg-secondary">
                
                <CalendarHeart className="h-5 w-5" />
                Book an Appointment
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-gt-lg">
            <img src="https://media.base44.com/images/public/6a4e90e55673f77beb8d6f49/eddf34c6f_Phlebotomistdrawingblood.jpg"

            alt="A compassionate phlebotomist caring for a senior patient at home."
            className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[500px]"
            loading="eager" />
            
          </div>
        </div>
      </div>
    </section>);

}