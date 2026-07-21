import React from "react";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

const details = [
  {
    icon: Phone,
    label: "Phone",
    content: (
      <a href="tel:+14022125964" className="font-semibold text-primary hover:text-secondary">
        (402) 212-5964
      </a>
    )
  },
  {
    icon: Mail,
    label: "Email",
    content: (
      <a
        href="mailto:gentletouchlabs27@gmail.com"
        className="font-semibold text-primary hover:text-secondary break-all"
      >
        gentletouchlabs27@gmail.com
      </a>
    )
  },
  {
    icon: Clock,
    label: "Hours",
    content: (
      <div className="font-semibold text-primary">
        <p>Mon-Fri 6am-6pm</p>
        <p>Sat 8am-3:30pm</p>
      </div>
    )
  },
  {
    icon: MapPin,
    label: "Service Area",
    content: <p className="font-semibold text-primary">Douglas &amp; Sarpy Counties</p>
  }
];

export default function ContactDetails() {
  return (
    <div className="rounded-xl bg-muted p-7 shadow-gt">
      <ul className="space-y-5">
        {details.map((d) => {
          const Icon = d.icon;
          return (
            <li key={d.label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <div>
                <p className="text-sm text-foreground/50">{d.label}</p>
                {d.content}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 overflow-hidden rounded-xl shadow-gt">
        <iframe
          title="Omaha Metro Service Area Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d96027.0!2d-96.131!3d41.2925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000"
          width="100%"
          height="280"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}