import { useState, type FormEvent } from "react";
import { HiArrowUpRight, HiOutlineClock, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <Reveal><SectionHeading eyebrow="We're just a call away" title={<>Let's talk about<br /><span>what you need.</span></>} description="Questions, directions, or help finding the right specialist? Our team is happy to help." /></Reveal>
        <div className="contact-layout">
          <Reveal className="contact-details">
            <a className="contact-item" href="https://maps.google.com/?q=18+Riverside+Avenue+Pune"><span className="contact-icon"><HiOutlineMapPin /></span><span><small>Come say hello</small><strong>18 Riverside Avenue<br />Pune, Maharashtra 411001</strong></span><HiArrowUpRight className="contact-arrow" /></a>
            <a className="contact-item" href="tel:+912240001234"><span className="contact-icon"><HiOutlinePhone /></span><span><small>Give us a call</small><strong>+91 22 4000 1234</strong></span><HiArrowUpRight className="contact-arrow" /></a>
            <a className="contact-item" href="mailto:hello@ayrahospital.example"><span className="contact-icon"><HiOutlineEnvelope /></span><span><small>Send us a note</small><strong>hello@ayrahospital.example</strong></span><HiArrowUpRight className="contact-arrow" /></a>
            <div className="contact-item contact-hours"><span className="contact-icon"><HiOutlineClock /></span><span><small>When we're here</small><strong>Mon – Sat, 8:00 AM – 8:00 PM<br />Emergency care available 24/7</strong></span></div>
            <a className="emergency-strip" href="tel:+912240009999"><span className="emergency-pulse" /><span><small>Need urgent help?</small><strong>Emergency line · +91 22 4000 9999</strong></span><HiArrowUpRight /></a>
          </Reveal>
          <Reveal className="contact-map" delay={0.08}>
            <div className="map-placeholder" role="img" aria-label="Map placeholder showing Ayra Hospital near Riverside Avenue in Pune">
              <div className="map-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div>
              <div className="map-road map-road--one" /><div className="map-road map-road--two" /><div className="map-road map-road--three" />
              <span className="map-water" aria-hidden="true" />
              <div className="map-marker"><span><HiOutlineMapPin /></span><strong>Ayra Hospital</strong><small>Riverside Avenue · Pune</small></div>
              <span className="map-label map-label--one">Riverside Park</span><span className="map-label map-label--two">RIVERSIDE AVE</span>
            </div>
            <div className="map-caption"><span><HiOutlineMapPin /> 18 Riverside Avenue, Pune</span><a href="https://maps.google.com/?q=18+Riverside+Avenue+Pune">Open directions <HiArrowUpRight /></a></div>
          </Reveal>
        </div>
        <Reveal className="contact-form-wrap">
          <div className="contact-form-heading"><span className="eyebrow">Prefer to write?</span><h3>Send us a message.</h3><p>We'll be in touch soon. This demo form doesn't send or store messages.</p></div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Your name<input name="name" type="text" placeholder="Your name" autoComplete="name" minLength={2} required /></label>
            <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label className="contact-message">How can we help?<textarea name="message" rows={3} placeholder="Write us a note..." minLength={5} required /></label>
            <button type="submit" className="button button--primary">Send a demo message <HiArrowUpRight aria-hidden="true" /></button>
            {sent && <p className="form-confirmation contact-confirmation" role="status">Thanks for reaching out. This is demo content; your message was not sent.</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
