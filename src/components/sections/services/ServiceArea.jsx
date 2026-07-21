import React from "react";

export default function ServiceArea() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Service Area</h3>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
              We proudly serve Douglas and Sarpy Counties, including Papillion, Bellevue,
              La Vista, Gretna, Elkhorn, Bennington, and Ralston. Travel beyond 25 miles may
              incur an additional fee based on the IRS standard mileage rate.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl shadow-gt-lg">
            <iframe
              title="Omaha Metro Service Area Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d96027.0!2d-96.131!3d41.2925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%" height="320" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}