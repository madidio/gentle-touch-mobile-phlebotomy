import React from "react";
import { Heart, Award, Clock, ShieldCheck, Lock } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion & Empathy", text: "Understanding the anxiety some patients feel." },
  { icon: Award, title: "Professionalism & Expertise", text: "Highly trained, certified phlebotomists." },
  { icon: Clock, title: "Convenience & Punctuality", text: "Respecting the patient's time and schedule." },
  { icon: ShieldCheck, title: "Safety & Accuracy", text: "Adherence to strict protocols for specimen integrity and patient safety." },
  { icon: Lock, title: "Confidentiality", text: "Maintaining strict HIPAA compliance and patient privacy." }
];

export default function AboutValues() {
  return (
    <section className="w-full bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <h3 className="font-heading text-xl font-semibold text-primary sm:text-2xl">Our Vision</h3>
          <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
            To enhance the quality of life for aging and homebound individuals by eliminating
            the barrier of travel for essential diagnostic testing, empowering individuals to
            take control of their health from the comfort of home. To become the most trusted
            name in mobile phlebotomy services.
          </p>
        </div>
        <div className="mt-12">
          <h3 className="font-heading text-xl font-semibold text-primary sm:text-2xl">Our Core Values</h3>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-gt">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{v.title}</p>
                    <p className="mt-1 text-sm text-foreground/70">{v.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}