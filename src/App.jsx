import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Providers from "@/pages/Providers";
import Contact from "@/pages/Contact";
import PageNotFound from "@/lib/PageNotFound";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;