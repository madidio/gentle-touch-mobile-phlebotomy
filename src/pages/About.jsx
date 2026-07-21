import React from "react";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutFounder from "@/components/sections/about/AboutFounder";
import AboutCredentials from "@/components/sections/about/AboutCredentials";
import Footer from "@/components/sections/Footer";

export default function About() {
  return (
    <main className="w-full bg-muted">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutFounder />
      <AboutCredentials />
      <Footer />
    </main>
  );
}