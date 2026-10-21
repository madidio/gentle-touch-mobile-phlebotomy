
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";

// Load the homepage immediately.
import Home from "@/pages/Home";

// Load other pages only when needed.
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Providers = lazy(() => import("@/pages/Providers"));
const Contact = lazy(() => import("@/pages/Contact"));
const PageNotFound = lazy(() => import("@/lib/PageNotFound"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<div aria-live="polite" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
