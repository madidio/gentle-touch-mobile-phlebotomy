import React from "react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services & Pricing", href: "/services" },
  { label: "Providers", href: "/providers" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "HIPAA Notice", href: "#hipaa" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 - Logo & Tagline */}
          <div>
            <img
              src="/images/Gentle-Touch-Logo.jpg"
              alt="Gentle Touch Mobile Blood Draw logo"
              className="h-auto w-72 max-w-full"
            />

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Bringing the lab to you, one gentle draw at a time.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#AC3C3F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h4>

            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href="tel:+14022125964"
                  className="transition-colors hover:text-[#AC3C3F]"
                >
                  (402) 212-5964
                </a>
              </li>

              <li>
                <a
                  href="mailto:gentletouchlabs27@gmail.com"
                  className="break-all transition-colors hover:text-[#AC3C3F]"
                >
                  gentletouchlabs27@gmail.com
                </a>
              </li>

              <li>Omaha Metro</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-sm text-white/60">
            © 2026 Gentle Touch Mobile Blood Draw, LLC. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-[#AC3C3F]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}