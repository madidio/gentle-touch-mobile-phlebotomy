import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgogzqep";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

const labelClass = "block text-sm font-semibold text-primary mb-1.5";

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubjectChange = (value) => {
    setForm((previousForm) => ({
      ...previousForm,
      subject: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_type: "Contact Form",
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          subject: form.subject || "General Inquiry",
          message: form.message,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const formspreeError =
          result?.errors
            ?.map((item) => item.message)
            .filter(Boolean)
            .join(", ") || "The form could not be submitted.";

        throw new Error(formspreeError);
      }

      setForm({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setSuccess(true);
    } catch (submitError) {
      console.error("Contact form submission failed:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please call us at (402) 212-5964."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-muted p-8 text-center shadow-gt">
        <CheckCircle2 className="h-14 w-14 text-secondary" />

        <p className="mt-4 text-lg font-semibold text-primary">
          Message sent!
        </p>

        <p className="mt-2 text-sm text-foreground/70">
          We&apos;ll get back to you shortly.
        </p>

        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setError("");
          }}
          className="mt-6 text-sm font-semibold text-secondary underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl bg-muted p-7 shadow-gt sm:p-8"
    >
      <div>
        <label htmlFor="full_name" className={labelClass}>
          Full Name <span className="text-destructive">*</span>
        </label>

        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          value={form.full_name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address <span className="text-destructive">*</span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="jane@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number <span className="text-destructive">*</span>
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
          placeholder="(402) 555-0100"
        />
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>

        <Select value={form.subject} onValueChange={handleSubjectChange}>
          <SelectTrigger
            id="subject"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="General Inquiry">
              General Inquiry
            </SelectItem>

            <SelectItem value="Schedule Appointment">
              Schedule Appointment
            </SelectItem>

            <SelectItem value="Pricing Question">
              Pricing Question
            </SelectItem>

            <SelectItem value="Provider Partnership">
              Provider Partnership
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={inputClass}
          placeholder="How can we help you?"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-200 hover:scale-[1.01] hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}