import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const serviceAreas = [
  "Papillion", "Bellevue", "La Vista", "Gretna", "Elkhorn", "Bennington", "Ralston"
];

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

const labelClass = "block text-sm font-semibold text-primary mb-1.5";

export default function BookingSection() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    preferred_date: "",
    preferred_time: "",
    draw_type: "Standard",
    fasting_required: false,
    draw_address: "",
    special_instructions: "",
    cancellation_acknowledged: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.BookingRequest.create(form);
      setSuccess(true);
      setForm({
        first_name: "", last_name: "", phone: "", email: "", preferred_date: "",
        preferred_time: "", draw_type: "Standard", fasting_required: false,
        draw_address: "", special_instructions: "",
        cancellation_acknowledged: false
      });
    } catch (err) {
      setError("Something went wrong. Please try again or call us at (402) 212-5964.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="w-full bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left Column - Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl bg-card p-7 shadow-gt sm:p-10">
              <h3 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
                Book Your Appointment Online
              </h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                Fill out the form below and we'll confirm your appointment within 24 hours.
                For urgent needs, call us at{" "}
                <a href="tel:+14022125964" className="font-semibold text-secondary underline">
                  (402) 212-5964
                </a>.
              </p>

              {success ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-accent/40 p-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-secondary" />
                  <p className="mt-4 text-lg font-semibold text-primary">
                    Thank you! Your request has been received.
                  </p>
                  <p className="mt-2 text-sm text-foreground/70">
                    We'll confirm your appointment within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-sm font-semibold text-secondary underline"
                  >
                    Book another appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first_name" className={labelClass}>
                        First Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="first_name" name="first_name" type="text" required
                        value={form.first_name} onChange={handleChange}
                        className={inputClass} placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className={labelClass}>
                        Last Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="last_name" name="last_name" type="text" required
                        value={form.last_name} onChange={handleChange}
                        className={inputClass} placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Contact row */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="phone" name="phone" type="tel" required
                        value={form.phone} onChange={handleChange}
                        className={inputClass} placeholder="(402) 555-0100"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        className={inputClass} placeholder="jane@email.com"
                      />
                    </div>
                  </div>

                  {/* Date & Time row */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="preferred_date" className={labelClass}>Preferred Date</label>
                      <input
                        id="preferred_date" name="preferred_date" type="date"
                        value={form.preferred_date} onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="preferred_time" className={labelClass}>Preferred Time</label>
                      <select
                        id="preferred_time" name="preferred_time"
                        value={form.preferred_time} onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select a time</option>
                        <option value="Morning (6am-9am)">Morning (6am-9am)</option>
                        <option value="Midday (9am-12pm)">Midday (9am-12pm)</option>
                        <option value="Afternoon (1pm-4pm)">Afternoon (1pm-4pm)</option>
                        <option value="Evening (4pm-6pm)">Evening (4pm-6pm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Draw type & Fasting */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="draw_type" className={labelClass}>Type of Draw</label>
                      <select
                        id="draw_type" name="draw_type"
                        value={form.draw_type} onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Stat">Stat</option>
                        <option value="Fasting">Fasting</option>
                      </select>
                    </div>
                    <div>
                      <span className={labelClass}>Fasting Required?</span>
                      <div className="flex h-[52px] items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox" name="fasting_required"
                            checked={form.fasting_required} onChange={handleChange}
                            className="h-5 w-5 rounded border-border text-secondary focus:ring-secondary/30"
                          />
                          <span className="text-base text-foreground/70">Yes, fasting is required</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="draw_address" className={labelClass}>Address for Draw</label>
                    <textarea
                      id="draw_address" name="draw_address" rows={2}
                      value={form.draw_address} onChange={handleChange}
                      className={inputClass} placeholder="123 Main St, Omaha, NE 68102"
                    />
                  </div>

                  {/* Special instructions */}
                  <div>
                    <label htmlFor="special_instructions" className={labelClass}>Special Instructions</label>
                    <textarea
                      id="special_instructions" name="special_instructions" rows={3}
                      value={form.special_instructions} onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g., anxiety, mobility issues, preferred vein"
                    />
                  </div>

                  {/* Cancellation Policy Acknowledgement */}
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox" name="cancellation_acknowledged"
                        checked={form.cancellation_acknowledged} onChange={handleChange} required
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-border text-secondary focus:ring-secondary/30"
                      />
                      <span className="text-sm leading-relaxed text-foreground/70">
                        I acknowledge and agree to the cancellation policy. Cancellations
                        made 24 hours in advance incur a $25 fee. Same-day cancellations are
                        non-refundable. <span className="text-destructive">*</span>
                      </span>
                    </label>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit" disabled={submitting}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-gt-lg transition-all duration-200 hover:scale-[1.01] hover:bg-[#9F8FBC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Book My Appointment"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Service Area */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-primary p-7 shadow-gt sm:p-8">
              {/* Contact Details */}
              <h4 className="font-heading text-xl font-semibold text-white">Contact Details</h4>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3 text-white/90">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-highlight" />
                  <div>
                    <p className="text-sm text-white/60">Phone</p>
                    <a href="tel:+14022125964" className="text-base font-semibold hover:text-highlight">
                      (402) 212-5964
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-highlight" />
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <a href="mailto:gentletouchlabs27@gmail.com" className="text-base font-semibold hover:text-highlight">
                      gentletouchlabs27@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-highlight" />
                  <div>
                    <p className="text-sm text-white/60">Hours</p>
                    <p className="text-base font-semibold">Mon-Fri 6am-6pm</p>
                    <p className="text-base font-semibold">Sat 8am-3:30pm</p>
                  </div>
                </li>
              </ul>

              {/* Service Area */}
              <div className="mt-8 border-t border-white/15 pt-6">
                <h4 className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
                  <MapPin className="h-5 w-5 text-highlight" />
                  Service Area
                </h4>
                <p className="mt-3 text-base font-semibold text-white/90">Douglas County &amp; Sarpy County</p>
                <p className="mt-1 text-sm text-white/60">Including:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span key={area} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6">
                <ShieldCheck className="h-6 w-6 shrink-0 text-highlight" />
                <p className="text-sm font-medium text-white/80">
                  Licensed &amp; Insured | HIPAA Compliant | OSHA Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}