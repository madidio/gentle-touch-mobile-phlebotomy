import React from "react";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutFounder from "@/components/sections/about/AboutFounder";
import AboutCredentials from "@/components/sections/about/AboutCredentials";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

export default function About() {
  return (
    <main className="w-full bg-muted">
      <PageMeta
        title="About Our Mobile Phlebotomy Service in Omaha"
        description="Learn about Gentle Touch Mobile Blood Draw and our compassionate approach to professional mobile phlebotomy for patients throughout the Omaha Metro."
        path="/about"
      />

      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutFounder />
      <AboutCredentials />
      <Footer />
    </main>
  );
}