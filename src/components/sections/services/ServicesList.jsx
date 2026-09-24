import React from "react";
import { Droplet, Clock, Moon, Heart, Calendar } from "lucide-react";

const services = [
  {
    icon: Droplet,
    title: "Standard Blood Draws",
    text: "Professional mobile blood collection for routine laboratory testing ordered by your healthcare provider.",
  },
  {
    icon: Clock,
    title: "Stat Blood Draws",
    text: "Priority mobile blood collection for time-sensitive lab orders and urgent testing needs.",
  },
  {
    icon: Moon,
    title: "Fasting Blood Draws",
    text: "Convenient early-morning mobile appointments for lab orders that require fasting.",
  },
  {
    icon: Heart,
    title: "Geriatric Phlebotomy",
    text: "Gentle, patient-centered blood draws for elderly and homebound patients in the comfort of home.",
  },
  {
    icon: Calendar,
    title: "Custom Scheduling",
    text: "Flexible mobile phlebotomy appointments designed around your scheduling needs.",
  },
];

export default function ServicesList() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.title}
                className="flex items-start gap-4 rounded-xl bg-muted p-6 shadow-gt"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {s.title}
                  </h3>

                  <p className="mt-1 text-sm text-foreground/60">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
