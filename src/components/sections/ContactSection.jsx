import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";
const labelClass = "block text-sm font-semibold text-primary mb-1.5";

export default function ContactSection() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.ContactMessage.create(form);
      setSuccess(true);
      setForm({ full_name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please call us at (402) 212-5964.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            We're Here to Help. Contact Us Today.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            Have questions? Want to book an appointment? We're just a call or click away.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left - Form */}
          <div className="rounded-xl bg-muted p-7 shadow-gt sm:p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center rounded-lg bg-accent/40 p-8 text-center">
                <CheckCircle2 className="h-14 w-14 text-secondary" />
                <p className="mt-4 text-lg font-semibold text-primary">Message sent!</p>
                <p className="mt-2 text-sm text-foreground/70">We'll get back to you shortly.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-semibold text-secondary underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="full_name" className={labelClass}>
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input id="full_name" name="full_name" type="text" required
                    value={form.full_name} onChange={handleChange}
                    className={inputClass} placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    className={inputClass} placeholder="jane@email.com" />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input id="phone" name="phone" type="tel" required
                    value={form.phone} onChange={handleChange}
                    className={inputClass} placeholder="(402) 555-0100" />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" name="message" rows={4}
                    value={form.message} onChange={handleChange}
                    className={inputClass} placeholder="How can we help you?" />
                </div>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
                )}
                <button type="submit" disabled={submitting}
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-200 hover:scale-[1.01] hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right - Contact details & map */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-card p-7 shadow-gt">
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm text-foreground/50">Phone</p>
                    <a href="tel:+14022125964" className="text-base font-semibold text-primary hover:text-secondary">(402) 212-5964</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm text-foreground/50">Email</p>
                    <a href="mailto:gentletouchlabs27@gmail.com" className="text-base font-semibold text-primary hover:text-secondary">gentletouchlabs27@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm text-foreground/50">Hours</p>
                    <p className="text-base font-semibold text-primary">Mon-Fri 6am-6pm</p>
                    <p className="text-base font-semibold text-primary">Sat 8am-3:30pm</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm text-foreground/50">Service Area</p>
                    <p className="text-base font-semibold text-primary">Douglas &amp; Sarpy Counties</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-xl shadow-gt">
              <iframe
                title="Omaha Metro Service Area Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d96027.0!2d-96.131!3d41.2925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%" height="280" style={{ border: 0 }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}