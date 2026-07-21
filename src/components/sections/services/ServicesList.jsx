import React from "react";
import { Droplet, Clock, Moon, Heart, Calendar } from "lucide-react";

const services = [
  { icon: Droplet, title: "Standard Blood Draws", text: "Routine lab work completed with care and precision." },
  { icon: Clock, title: "Stat Blood Draws", text: "Urgent lab needs with expedited processing." },
  { icon: Moon, title: "Fasting Blood Draws", text: "Early morning appointments for fasting requirements." },
  { icon: Heart, title: "Geriatric Phlebotomy", text: "Specialized, gentle care for elderly patients." },
  { icon: Calendar, title: "Custom Scheduling", text: "Flexible appointment times that fit your needs." }
];

export default function ServicesList() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="flex items-start gap-4 rounded-xl bg-muted p-6 shadow-gt">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary">{s.title}</h3>
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