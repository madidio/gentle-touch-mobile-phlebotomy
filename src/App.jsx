
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import ScrollToTop from "@/components/ScrollToTop";

const ManageAppointment = lazy(() => import("@/pages/ManageAppointment"));
const RecoveryPreview = lazy(() => import("@/pages/RecoveryPreview"));
const PaymentsAdmin = lazy(() => import("@/pages/PaymentsAdmin"));
const PaymentResult = lazy(() => import("@/pages/PaymentResult"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Providers = lazy(() => import("@/pages/Providers"));
const Contact = lazy(() => import("@/pages/Contact"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/recovery-preview" element={<RecoveryPreview/>} />
          <Route path="/admin/payments" element={<PaymentsAdmin />} />
          <Route path="/manage-appointment" element={<ManageAppointment />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

