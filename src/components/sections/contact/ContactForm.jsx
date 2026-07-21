import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";
const labelClass = "block text-sm font-semibold text-primary mb-1.5";

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubjectChange = (val) => {
    setForm((prev) => ({ ...prev, subject: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.ContactMessage.create({
        ...form,
        message: form.message ? `[${form.subject}] ${form.message}` : `[${form.subject}]`
      });
      setSuccess(true);
      setForm({ full_name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please call us at (402) 212-5964.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-muted p-8 text-center shadow-gt">
        <CheckCircle2 className="h-14 w-14 text-secondary" />
        <p className="mt-4 text-lg font-semibold text-primary">Message sent!</p>
        <p className="mt-2 text-sm text-foreground/70">We'll get back to you shortly.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-semibold text-secondary underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-muted p-7 shadow-gt sm:p-8">
      <div>
        <label htmlFor="full_name" className={labelClass}>
          Full Name <span className="text-destructive">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
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
          <SelectTrigger className="w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
            <SelectItem value="Schedule Appointment">Schedule Appointment</SelectItem>
            <SelectItem value="Pricing Question">Pricing Question</SelectItem>
            <SelectItem value="Provider Partnership">Provider Partnership</SelectItem>
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
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-white shadow-gt-lg transition-all duration-200 hover:scale-[1.01] hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}