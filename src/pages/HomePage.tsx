import { useEffect } from "react";
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

export default function HomePage() {
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
        <DoctorsSection />
        <WhyChooseUsSection />
        <AppointmentSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
