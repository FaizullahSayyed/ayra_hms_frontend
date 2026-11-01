import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../sections/AboutSection";
import AppointmentSection from "../sections/AppointmentSection";
import ContactSection from "../sections/ContactSection";
import DoctorsSection from "../sections/DoctorsSection";
import HeroSection from "../sections/HeroSection";
import ServicesSection from "../sections/ServicesSection";
import StatisticsSection from "../sections/StatisticsSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import WhyChooseUsSection from "../sections/WhyChooseUsSection";
import type { Doctor } from "../data/hospital";

export default function HomePage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const clearSelectedDoctor = useCallback(() => setSelectedDoctor(null), []);

  useEffect(() => {
    if (window.location.hash) {
      requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatisticsSection />
        <ServicesSection />
        <AboutSection />
        <DoctorsSection onRequestAppointment={setSelectedDoctor} />
        <WhyChooseUsSection />
        <AppointmentSection
          selectedDoctor={selectedDoctor}
          onDoctorSelectionApplied={clearSelectedDoctor}
        />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
