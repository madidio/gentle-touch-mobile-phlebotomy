import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import AboutHero from "@/components/sections/about/AboutHero";
import BookingSection from "@/components/sections/BookingSection";
import Footer from "@/components/sections/Footer";
import PageMeta from "@/components/seo/PageMeta";

function Home() {
  return (
    <>
      <PageMeta
        title="Mobile Phlebotomy in Omaha, NE"
        description="Professional mobile blood draws in Omaha, Douglas County, Sarpy County, and nearby Nebraska communities. Gentle Touch brings compassionate phlebotomy services to you."
        path="/"
      />

      <Hero />
      <Services />
      <AboutHero />
      <BookingSection />
      <Footer />
    </>
  );
}

export default Home;