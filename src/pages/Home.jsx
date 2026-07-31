import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import AboutHero from "@/components/sections/about/AboutHero";
import BookingSection from "@/components/sections/BookingSection";
import Footer from "@/components/sections/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AboutHero />
      <BookingSection />
      <Footer />
    </>
  );
}

export default Home;