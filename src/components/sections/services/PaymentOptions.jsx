import React from "react";
import { CreditCard, Smartphone } from "lucide-react";

export default function PaymentOptions() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <h3 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Simple &amp; Secure Payments</h3>
          <p className="mt-4 text-base text-foreground/60 sm:text-lg">
            We accept payments through Stripe and Venmo for your convenience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Stripe */}
          <div className="flex flex-col items-center rounded-xl bg-muted p-8 text-center shadow-gt">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
              <CreditCard className="h-7 w-7 text-secondary" />
            </div>
            <h4 className="mt-4 font-heading text-lg font-semibold text-primary">Pay with Stripe</h4>
            <p className="mt-2 text-sm text-foreground/60">
              Use your credit card, debit card, or HSA card securely online.
            </p>
            <a
              href="https://buy.stripe.com/aFa00j65dcLq98w9YPfQI03"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-base font-semibold text-white shadow-gt transition-all hover:scale-[1.02] hover:bg-primary"
            >
              <CreditCard className="h-5 w-5" /> Pay with Stripe
            </a>
          </div>

          {/* Venmo */}
          <div className="flex flex-col items-center rounded-xl bg-muted p-8 text-center shadow-gt">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
              <Smartphone className="h-7 w-7 text-secondary" />
            </div>
            <h4 className="mt-4 font-heading text-lg font-semibold text-primary">Pay with Venmo</h4>
            <p className="mt-2 text-sm text-foreground/60">
              Quick and easy payments directly from the Venmo app. Scan the QR code or find
              us at <span className="font-semibold text-secondary">@gentletouchlabs27</span>.
            </p>
            <a
              href="https://www.venmo.com/u/gentletouchlabs27"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-gt transition-all hover:scale-[1.02] hover:bg-secondary"
            >
              <Smartphone className="h-5 w-5" /> Pay with Venmo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}