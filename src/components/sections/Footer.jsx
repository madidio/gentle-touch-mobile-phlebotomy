import React from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services & Pricing", href: "/services" },
  { label: "For Providers", href: "/providers" },
  { label: "Contact", href: "/contact" },
  { label: "Blog/Resources", href: "#blog" }
];

const legalLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "HIPAA Notice", href: "#hipaa" }
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 - Logo & Tagline */}
          <div>
            <img
              src="https://media.base44.com/images/public/6a51133670dca936488666fd/9d6bd26ec_GentletouchLogo.jpg"
              alt="Gentle Touch Mobile Blood Draw logo"
              className="h-auto w-40 max-w-full"
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
                  <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-[#AC3C3F]">
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
                <a href="tel:+14022125964" className="transition-colors hover:text-[#AC3C3F]">
                  (402) 212-5964
                </a>
              </li>
              <li>
                <a href="mailto:gentletouchlabs27@gmail.com" className="transition-colors hover:text-highlight break-all">
                  gentletouchlabs27@gmail.com
                </a>
              </li>
              <li>Omaha Metro</li>
            </ul>
          </div>

          {/* Column 4 - Social Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Follow Us
            </h4>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.label} href={social.href} aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#AC3C3F] hover:text-white">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-sm text-white/60">
            © 2026 Gentle Touch Mobile Blood Draw, LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-[#AC3C3F]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}