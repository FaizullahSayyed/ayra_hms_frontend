import { useRef, useState, type FormEvent } from "react";
import { HiArrowUpRight, HiOutlineClock, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { submitContactMessage } from "../api/client";

export default function ContactSection() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    submitting.current = true;
    setIsSubmitting(true);
    setConfirmation("");
    setError("");

    try {
      const values = new FormData(form);
      const result = await submitContactMessage({
        name: String(values.get("name") ?? ""),
        email: String(values.get("email") ?? ""),
        message: String(values.get("message") ?? ""),
      });
      setConfirmation(result.message);
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send your message. Please try again.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
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
          <div className="contact-form-heading"><span className="eyebrow">Prefer to write?</span><h3>Send us a message.</h3><p>Your message is saved only when submission succeeds.</p></div>
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <label>Your name<input name="name" type="text" placeholder="Your name" autoComplete="name" minLength={2} maxLength={120} required /></label>
            <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required /></label>
            <label className="contact-message">How can we help?<textarea name="message" rows={3} placeholder="Write us a note..." minLength={5} maxLength={2000} required /></label>
            <button type="submit" className="button button--primary" disabled={isSubmitting}>{isSubmitting ? "Sending…" : <>Send message <HiArrowUpRight aria-hidden="true" /></>}</button>
            {confirmation && <p className="form-confirmation contact-confirmation" role="status">{confirmation}</p>}
            {error && <p className="form-error contact-confirmation" role="alert">{error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
