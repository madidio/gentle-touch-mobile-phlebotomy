import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_type: "Homepage Contact Form",
          ...form,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.errors?.map((e) => e.message).join(", ") ||
            "Unable to send message."
        );
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="mb-8 text-3xl font-bold">
          Contact Us
        </h2>

        {success ? (
          <div className="rounded-lg border p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h3 className="text-xl font-semibold">
              Thank you!
            </h3>
            <p>Your message has been sent successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="full_name"
              placeholder="Full Name"
              required
              value={form.full_name}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Message"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />

            {error && (
              <p className="text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-6 py-3 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

          </form>
        )}
      </div>
    </section>
  );
}