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

import { paymentsEnabled, paymentApi } from "@/lib/payments";
import {windowsForDay,addDays,BOOKING_DAYS} from "../../../shared/schedule.mjs";

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
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part=type=>parts.find(p=>p.type===type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function timeWindowLabel(window) {
  return window.replace(/\((\d+)(am|pm)-(\d+)(am|pm)\)/,(_,start,startPeriod,end,endPeriod)=>
    startPeriod===endPeriod ? `(${start}–${end} ${endPeriod.toUpperCase()})` : `(${start} ${startPeriod.toUpperCase()}–${end} ${endPeriod.toUpperCase()})`);
}

export default function BookingSection() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [quote, setQuote] = useState(null);
  const [holdUntil,setHoldUntil]=useState(null);
  const [bookingMethod, setBookingMethod] = useState("online");
  const [slots, setSlots] = useState([]);
  const requestRef = useRef(null);
  useEffect(() => {
    if (!paymentsEnabled) return;
    const refresh=()=>paymentApi('availability').then(x=>setSlots(x.slots)).catch(e=>setError(e.message));
    refresh();const timer=setInterval(refresh,60000);return ()=>clearInterval(timer);
  }, []);
  const checkout = async () => {
    setSubmitting(true); setError('');
    try { const result=await paymentApi('checkout', {...requestRef.current,id:quote.id}); window.location.assign(result.url); }
    catch(e){setError(e.message);setSubmitting(false);}
  };
  const statusRef = useRef(null);
  const minimumDate = paymentsEnabled ? addDays(getTodayString(),1) : getTodayString();

  useEffect(() => {
    if ((success || error) && statusRef.current) {
      statusRef.current.focus();
    }
  }, [success, error]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setQuote(null); requestRef.current=null;
    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "preferred_date" ? {preferred_time:""} : {}),
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
      if (!form.cancellation_acknowledged) throw new Error('Please agree to the policies.');
      if (paymentsEnabled) {
        if (!requestRef.current) requestRef.current = {requestKey:crypto.randomUUID(),token:crypto.randomUUID()+crypto.randomUUID()};
        const result=await paymentApi(bookingMethod==='invoice' ? 'request_invoice' : 'quote',{form,...requestRef.current});
        if(bookingMethod==='invoice' && result.status!=='pending'){requestRef.current=null;throw new Error('This request is no longer active. Please submit a new request.');}
        if(bookingMethod==='invoice'){setHoldUntil(result.holdExpiresAt);setForm(initialForm);requestRef.current=null;setSuccess(true);return;}
        sessionStorage.setItem('gentle-touch-payment',JSON.stringify({...requestRef.current,id:result.id}));
        setQuote(result); return;
      }
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
                Request a Mobile Blood Draw Appointment
              </h2>

              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                {paymentsEnabled ? "Choose an available window, then pay online or request an invoice for review." : "Complete the form below and we will contact you to review availability and confirm your appointment request. Submitting this form does not create a confirmed appointment."}
              </p>

              <div className="mt-3 text-sm leading-relaxed text-foreground/70">
                <p>For time-sensitive needs, call:</p>

                <div className="mt-1 space-y-1">
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
                    {paymentsEnabled && bookingMethod==='invoice' ? "Your invoice request has been received." : "Thank you! Your appointment request has been received."}
                  </p>

                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/70">
                    {paymentsEnabled && bookingMethod==='invoice' ? "We will review your request and email an invoice with the draw fee and any mileage charge. No payment has been taken. Your selected window is temporarily held while we review your request. Payment confirms your appointment." : "We will contact you to review availability and confirm the appointment details. Your appointment is not confirmed until you hear from us."}
                  </p>

                  {holdUntil && <p className="mt-3 text-sm">Your hold expires {new Date(holdUntil).toLocaleString('en-US',{timeZone:'America/Chicago',dateStyle:'medium',timeStyle:'short'})} Omaha time. If unpaid, the window reopens after the invoice is closed.</p>}
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setHoldUntil(null);
                      setError("");
                    }}
                    className="mt-6 rounded-md text-sm font-semibold text-secondary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {paymentsEnabled && <fieldset className="rounded-lg border border-border bg-white p-4 space-y-3">
                    <legend className={labelClass}>How would you like to book?</legend>
                    <label className="flex items-center gap-3"><input type="radio" name="booking_method" value="online" checked={bookingMethod==='online'} onChange={()=>{setBookingMethod('online');setQuote(null);requestRef.current=null;}}/> Pay online to confirm</label>
                    <label className="flex items-center gap-3"><input type="radio" name="booking_method" value="invoice" checked={bookingMethod==='invoice'} onChange={()=>{setBookingMethod('invoice');setQuote(null);requestRef.current=null;}}/> Request appointment—receive an invoice</label>
                    {bookingMethod==='invoice' && <p className="text-sm text-foreground/70">We will review your details and email an invoice before your visit. Collection is $80 plus $0.725 per one-way driving mile beyond 25 miles. Your window is held for up to 24 hours or until it starts, whichever comes first. No payment is taken when you submit. Unpaid holds reopen after any invoice is closed.</p>}
                  </fieldset>}
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
                        max={paymentsEnabled ? addDays(getTodayString(),BOOKING_DAYS) : undefined}
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
                        disabled={paymentsEnabled && !form.preferred_date}
                        name="preferred_time"
                        required
                        value={form.preferred_time}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select a time</option>
                        {(paymentsEnabled ? windowsForDay(form.preferred_date).filter(window=>slots.some(slot=>slot.day===form.preferred_date && slot.time_window===window)) : ['Morning (6am-9am)','Midday (9am-12pm)','Afternoon (1pm-4pm)','Evening (4pm-6pm)']).map(window=><option key={window} value={window} disabled={paymentsEnabled && !slots.some(s=>s.day===form.preferred_date && s.time_window===window)}>{timeWindowLabel(window)}</option>)}
                      </select>
                      {paymentsEnabled && form.preferred_date && !slots.some(s=>s.day===form.preferred_date) && <p role="status" className="mt-2 text-sm">No windows are available on this date. Please choose another date.</p>}
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
                        I have read and agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a> and <a href="/services" target="_blank" rel="noopener noreferrer" className="underline">Cancellation &amp; Refund Policy</a>. Cancellations before the appointment calendar day (Omaha time): refund minus $25. Same-day cancellations are nonrefundable, subject to applicable law and exceptions. Eligible refunds use the original payment method.{" "}
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

                  {quote && <div role="status" className="rounded-lg border border-border bg-white p-4 space-y-2">
                    <p>One-way driving distance: {quote.miles.toFixed(2)} miles (first 25 included)</p>
                    <p>Collection: $80.00</p><p>Travel: ${(quote.travel/100).toFixed(2)}</p>
                    <p className="font-semibold">Total due now: ${(quote.total/100).toFixed(2)}</p>
                    <button type="button" disabled={submitting} onClick={checkout} className="rounded-lg bg-secondary px-6 py-3 text-white disabled:opacity-60">Pay in full with Stripe</button>
                    <p className="text-sm">Your quote is valid for 24 hours, subject to appointment availability. Your window is reserved when checkout starts. Already received an invoice? Use its payment link; contact us before creating another request.</p>
                  </div>}
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
                      paymentsEnabled ? (bookingMethod==='invoice' ? "Request appointment and invoice" : "Calculate Total") : "Request My Appointment"
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