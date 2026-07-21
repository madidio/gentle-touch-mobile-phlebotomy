import React from "react";
import Hero from "@/components/sections/Hero";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowItWorks from "@/components/sections/HowItWorks";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import BookingSection from "@/components/sections/BookingSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <Services />
      <Testimonials />
      <BookingSection />
      <ContactSection />
      <Footer />
    </main>
  );
}