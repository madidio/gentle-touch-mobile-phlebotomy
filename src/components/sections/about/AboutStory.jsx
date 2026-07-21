import React from "react";

export default function AboutStory() {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">The Story</h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground sm:text-lg">
          <p>
            Gentle Touch Mobile Blood Draw was founded by Kofi Gunubu, a certified
            phlebotomist (CPT, ASCP) with over a decade of hands-on experience drawing blood
            for adult patients. Kofi has worked in hospitals, clinics, and outpatient
            settings, giving him a deep understanding of what patients experience—and what
            they truly need to feel comfortable and cared for.
          </p>
          <p>
            Kofi saw a gap in care for elderly and homebound individuals who struggle with
            transportation or anxiety around lab work. His solution was simple yet powerful:
            bring the lab to the patient. By eliminating the stress of travel and waiting
            rooms, we make essential lab work accessible, convenient, and dignified.
          </p>
          <p>
            Our approach is built on what Kofi has learned from thousands of successful draws:
            patience, a gentle touch, and clear communication make all the difference. We
            take the time to listen, to calm fears, and to ensure every patient feels
            respected and at ease.
          </p>
        </div>
      </div>
    </section>
  );
}