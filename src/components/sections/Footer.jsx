import React from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services & Pricing", href: "/services" },
  { label: "Providers", href: "/providers" },
  { label: "Contact", href: "/contact" },
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
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#AC3C3F]"
                  >
                    {link.label}
                  </Link>
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
                <div className="space-y-1">
  <a
    href="tel:+14022125964"
    className="block text-base font-semibold hover:text-highlight"
  >
    Primary: (402) 212-5964
  </a>

  <a
    href="tel:+14027399898"
    className="block text-base font-semibold hover:text-highlight"
  >
    Alternate: (402) 739-9898
  </a>
</div>
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
        <div className="mt-12 border-t border-white/15 pt-6 text-center">
          <p className="text-sm text-white/60">
            © 2026 Gentle Touch Mobile Blood Draw, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}