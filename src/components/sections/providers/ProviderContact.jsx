import React from "react";
import { Phone, Mail, Shield, BadgeCheck, MapPin } from "lucide-react";

const credentials = [
  "Master of Public Health (MPH)",
  "CPT (ASCP) — Certified Phlebotomy Technician",
  "10+ Years Clinical Experience",
  "Licensed & Insured",
  "Background Checked",
  "OSHA & HIPAA Compliant"
];

export default function ProviderContact() {
  return (
    <section className="w-full bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <h3 className="text-center font-heading text-2xl font-semibold text-primary sm:text-3xl">
          Provider Contact &amp; Credentials
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contact + NPI */}
          <div className="rounded-xl bg-white p-7 shadow-gt">
            <h4 className="font-heading text-lg font-semibold text-primary">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary" />
                <a href="tel:+14022125964" className="text-base font-medium text-foreground hover:text-secondary">(402) 212-5964</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <a href="mailto:gentletouchlabs27@gmail.com" className="text-base font-medium text-foreground hover:text-secondary break-all">gentletouchlabs27@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-base text-foreground/80">NPI: 1669321485</span>
              </li>
              <li className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-base text-foreground/80">Liability Insurance #: VK0712</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <MapPin className="h-5 w-5 text-secondary" />
              <span className="text-base text-foreground/80">Service Area: Douglas &amp; Sarpy Counties</span>
            </div>
          </div>

          {/* Credentials */}
          <div className="rounded-xl bg-white p-7 shadow-gt">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-6 w-6 text-secondary" />
              <h4 className="font-heading text-lg font-semibold text-primary">Kofi's Credentials</h4>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span className="text-sm text-foreground/70">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}