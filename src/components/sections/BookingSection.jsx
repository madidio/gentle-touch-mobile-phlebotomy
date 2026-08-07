import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const FORMSPREE_ENDPOINT =
  import.meta.env.VITE_FORMSPREE_ENDPOINT ||
  "https://formspree.io/f/xgogzqep";

const serviceAreas = [
  "Papillion",
  "Bellevue",
  "La Vista",
  "Gretna",
  "Elkhorn",
  "Bennington",
  "Ralston",
];

const initialForm = {
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
  cancellation_acknowledged: false,

  // Honeypot field for basic spam protection.
  company: "",
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1.5 block text-sm font-semibold text-primary";

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookingSection() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const statusRef = useRef(null);
  const minimumDate = getTodayString();

  useEffect(() => {
    if ((success || error) && statusRef.current) {
      statusRef.current.focus();
    }
  }, [success, error]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Silently ignore likely automated submissions.
    if (form.company) {
      return;
    }

    setSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_type: "Appointment Request",
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          draw_type: form.draw_type,
          fasting_required: form.fasting_required ? "Yes" : "No",
          draw_address: form.draw_address.trim(),
          special_instructions:
            form.special_instructions.trim() || "None provided",
          cancellation_acknowledged: form.cancellation_acknowledged
            ? "Yes"
            : "No",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const formspreeError =
          result?.errors
            ?.map((item) => item.message)
            .filter(Boolean)
            .join(", ") ||
          "The appointment request could not be submitted.";

        throw new Error(formspreeError);
      }

      setForm(initialForm);
      setSuccess(true);
    } catch (submitError) {
      console.error("Appointment form submission failed:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again or call us at (402) 212-5964 or (402) 739-9898 to request an appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="book"
      aria-labelledby="booking-heading"
      className="w-full scroll-mt-24 bg-muted py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Appointment form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl bg-card p-7 shadow-gt sm:p-10">
              <h2
                id="booking-heading"
                className="font-heading text-2xl font-semibold text-primary sm:text-3xl"
              >
                Request an Appointment
              </h2>

              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                Complete the form below and we will contact you to review
                availability and confirm your appointment request. Submitting
                this form does not create a confirmed appointment.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                For time-sensitive needs, call{" "}
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
                .
              </p>

              {success ? (
                <div
                  ref={statusRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  className="mt-8 flex flex-col items-center justify-center rounded-lg bg-accent/40 p-8 text-center outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-14 w-14 text-secondary"
                  />

                  <p className="mt-4 text-lg font-semibold text-primary">
                    Thank you! Your appointment request has been received.
                  </p>

                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/70">
                    We will contact you to review availability and confirm the
                    appointment details. Your appointment is not confirmed
                    until you hear from us.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setError("");
                    }}
                    className="mt-6 rounded-md text-sm font-semibold text-secondary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="booking-company">
                      Leave this field empty
                    </label>
                    <input
                      id="booking-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first_name" className={labelClass}>
                        First Name{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        maxLength={80}
                        autoComplete="given-name"
                        value={form.first_name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Jane"
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className={labelClass}>
                        Last Name{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        maxLength={80}
                        autoComplete="family-name"
                        value={form.last_name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        maxLength={30}
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="(402) 555-0100"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email Address{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={120}
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="jane@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="preferred_date"
                        className={labelClass}
                      >
                        Preferred Date{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <input
                        id="preferred_date"
                        name="preferred_date"
                        type="date"
                        required
                        min={minimumDate}
                        value={form.preferred_date}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preferred_time"
                        className={labelClass}
                      >
                        Preferred Time{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </label>

                      <select
                        id="preferred_time"
                        name="preferred_time"
                        required
                        value={form.preferred_time}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select a time</option>
                        <option value="Morning (6am-9am)">
                          Morning (6am–9am)
                        </option>
                        <option value="Midday (9am-12pm)">
                          Midday (9am–12pm)
                        </option>
                        <option value="Afternoon (1pm-4pm)">
                          Afternoon (1pm–4pm)
                        </option>
                        <option value="Evening (4pm-6pm)">
                          Evening (4pm–6pm)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="draw_type" className={labelClass}>
                        Type of Draw
                      </label>

                      <select
                        id="draw_type"
                        name="draw_type"
                        value={form.draw_type}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Stat">Stat or time-sensitive</option>
                        <option value="Fasting">Fasting</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>

                    <fieldset>
                      <legend className={labelClass}>
                        Fasting Required?
                      </legend>

                      <div className="flex min-h-[52px] items-center">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            name="fasting_required"
                            checked={form.fasting_required}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-border text-secondary focus:ring-secondary/30"
                          />

                          <span className="text-base text-foreground/70">
                            Yes, fasting is required
                          </span>
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  <div>
                    <label htmlFor="draw_address" className={labelClass}>
                      Address for Draw{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </label>

                    <textarea
                      id="draw_address"
                      name="draw_address"
                      rows={2}
                      required
                      maxLength={300}
                      autoComplete="street-address"
                      value={form.draw_address}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="123 Main St, Omaha, NE 68102"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="special_instructions"
                      className={labelClass}
                    >
                      Special Instructions
                    </label>

                    <textarea
                      id="special_instructions"
                      name="special_instructions"
                      rows={3}
                      maxLength={1000}
                      value={form.special_instructions}
                      onChange={handleChange}
                      className={inputClass}
                      aria-describedby="special-instructions-help"
                      placeholder="Accessibility needs, mobility considerations, or other helpful details"
                    />

                    <p
                      id="special-instructions-help"
                      className="mt-1.5 text-xs leading-relaxed text-foreground/60"
                    >
                      Please avoid including diagnoses, test results, Social
                      Security numbers, insurance IDs, or unnecessary medical
                      details.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="cancellation_acknowledged"
                        checked={form.cancellation_acknowledged}
                        onChange={handleChange}
                        required
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-border text-secondary focus:ring-secondary/30"
                      />

                      <span className="text-sm leading-relaxed text-foreground/70">
                        I acknowledge the cancellation policy. Cancellations
                        made less than 24 hours before an appointment may incur
                        a $25 fee. Same-day cancellations may be
                        non-refundable.{" "}
                        <span
                          className="text-destructive"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="text-sm leading-relaxed text-foreground/70">
                      By submitting this form, you authorize Gentle Touch
                      Mobile Blood Draw to contact you about your appointment
                      request. Please do not include unnecessary medical
                      information. This form is not for emergencies. Call 911
                      for a medical emergency.
                    </p>
                  </div>

                  {error && (
                    <div
                      ref={statusRef}
                      tabIndex={-1}
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive outline-none focus-visible:ring-4 focus-visible:ring-destructive/20"
                    >
                      <AlertCircle
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0"
                      />

                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-gt-lg transition-all duration-200 hover:scale-[1.01] hover:bg-[#9F8FBC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          aria-hidden="true"
                          className="h-5 w-5 animate-spin"
                        />
                        Submitting request...
                      </>
                    ) : (
                      "Request My Appointment"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact details */}
          <aside className="lg:col-span-2" aria-label="Contact information">
            <div className="rounded-xl bg-primary p-7 shadow-gt sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-white">
                Contact Details
              </h2>

              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3 text-white/90">
                  <Phone
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-highlight"
                  />

                  <div>
                    <p className="text-sm text-white/70">Phone</p>
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
                  </div>
                </li>

                <li className="flex items-start gap-3 text-white/90">
                  <Mail
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-highlight"
                  />

                  <div className="min-w-0">
                    <p className="text-sm text-white/70">Email</p>
                    <a
                      href="mailto:gentletouchlabs27@gmail.com"
                      className="break-all text-base font-semibold hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                    >
                      gentletouchlabs27@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-white/90">
                  <Clock
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-highlight"
                  />

                  <div>
                    <p className="text-sm text-white/70">Hours</p>
                    <p className="text-base font-semibold">
                      Monday–Friday: 6am–6pm
                    </p>
                    <p className="text-base font-semibold">
                      Saturday: 8am–3:30pm
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 border-t border-white/15 pt-6">
                <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
                  <MapPin
                    aria-hidden="true"
                    className="h-5 w-5 text-highlight"
                  />
                  Service Area
                </h2>

                <p className="mt-3 text-base font-semibold text-white/90">
                  Douglas County &amp; Sarpy County
                </p>

                <p className="mt-1 text-sm text-white/70">Including:</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6">
                <ShieldCheck
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-highlight"
                />

                <p className="text-sm font-medium text-white/90">
                  Licensed &amp; Insured · Professional Specimen Collection
                </p>
              </div>

              <div className="mt-6 rounded-lg bg-white/10 p-4">
                <p className="text-sm leading-relaxed text-white/90">
                  Appointment requests are reviewed before confirmation.
                  Availability, preparation requirements, and service details
                  will be confirmed directly with you.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}