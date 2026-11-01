import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HiArrowLeft, HiArrowRight, HiOutlineStar } from "react-icons/hi2";
import { testimonials } from "../data/hospital";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();
  const testimonial = testimonials[current];
  const change = (direction: number) => setCurrent((index) => (index + direction + testimonials.length) % testimonials.length);

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container testimonial-layout">
        <Reveal className="testimonial-intro"><SectionHeading eyebrow="Kind words, real people" title={<>The little things<br /><span>mean a lot.</span></>} description="Every care journey is different. We're grateful to be part of theirs." /><div className="testimonial-controls"><button type="button" className="icon-button carousel-button" onClick={() => change(-1)} aria-label="Previous testimonial"><HiArrowLeft /></button><button type="button" className="icon-button carousel-button carousel-button--next" onClick={() => change(1)} aria-label="Next testimonial"><HiArrowRight /></button><span>{String(current + 1).padStart(2, "0")} <i>/</i> {String(testimonials.length).padStart(2, "0")}</span></div></Reveal>
        <div className="testimonial-card-wrap">
          <span className="quote-mark" aria-hidden="true">“</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={testimonial.name} className="testimonial-card" initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -16 }} transition={{ duration: reduceMotion ? 0 : 0.28 }}>
              <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <HiOutlineStar key={index} aria-hidden="true" />)}<span>5.0</span></div>
              <blockquote>{testimonial.quote}</blockquote>
              <div className="testimonial-person"><img src={testimonial.image} alt="" loading="lazy" /><div><strong>{testimonial.name}</strong><span>{testimonial.detail}</span></div><span className="patient-note">Patient story</span></div>
            </motion.article>
          </AnimatePresence>
          <div className="testimonial-decoration" aria-hidden="true">✳</div>
        </div>
      </div>
      <div className="container testimonial-foot"><span>Shared with permission</span><span className="testimonial-foot-line" /><span>Experiences may vary. Testimonials are illustrative sample content.</span></div>
    </section>
  );
}
