import { motion, useReducedMotion } from "motion/react";
import { HiArrowUpRight, HiOutlineCalendarDays, HiOutlineClock, HiOutlineHeart, HiOutlineShieldCheck } from "react-icons/hi2";
import Reveal from "../components/Reveal";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="hero-section" id="home">
      <div className="hero-backdrop" aria-hidden="true"><span className="hero-orb hero-orb--one" /><span className="hero-orb hero-orb--two" /><span className="hero-grid" /></div>
      <div className="container hero-layout">
        <div className="hero-content">
          <Reveal>
            <div className="hero-kicker"><span className="kicker-pulse" /> Care for every chapter <span className="kicker-divider" /> Trusted since 2008</div>
            <h1>Your Health,<br />Our <span>Priority.</span></h1>
            <p className="hero-copy">Experience compassionate healthcare powered by modern technology, expert doctors, and personalized treatment.</p>
            <div className="hero-actions">
              <a className="button button--primary button--large" href="#appointment">Request an appointment <HiArrowUpRight aria-hidden="true" /></a>
              <a className="button button--text button--large" href="#services"><span className="play-icon">↘</span> Explore our services</a>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=75" alt="" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=75" alt="" />
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=75" alt="" />
              </div>
              <div><strong>Care that feels personal</strong><span>For every age. Every day.</span></div>
              <span className="trust-divider" />
              <div className="trust-heart"><HiOutlineHeart aria-hidden="true" /></div>
              <span className="trust-note">Here for you</span>
            </div>
          </Reveal>
        </div>

        <div className="hero-visual">
          <motion.div className="hero-photo-shell" initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.12 }}>
            <img className="hero-photo" src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=88" alt="Surgeons working together in a modern operating room" fetchPriority="high" />
            <div className="photo-caption"><span className="caption-mark"><HiOutlineShieldCheck aria-hidden="true" /></span><span><strong>Care you can count on</strong><small>By your side, at every step</small></span></div>
          </motion.div>
          <motion.div className="floating-card floating-card--appointment" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <span className="float-icon float-icon--blue"><HiOutlineCalendarDays aria-hidden="true" /></span>
            <span><strong>Care starts here</strong><small>Find your specialist</small></span>
            <a href="#appointment" aria-label="Request an appointment"><HiArrowUpRight /></a>
          </motion.div>
          <motion.div className="floating-card floating-card--emergency" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
            <span className="emergency-pulse"><HiOutlineClock aria-hidden="true" /></span>
            <span><strong>Emergency care</strong><small>Open 24 hours, every day</small></span>
            <a href="tel:+912240009999" aria-label="Call emergency support">↗</a>
          </motion.div>
          <div className="hero-sparkle hero-sparkle--one" aria-hidden="true">✳</div>
          <div className="hero-sparkle hero-sparkle--two" aria-hidden="true">✳</div>
        </div>
      </div>
      <div className="hero-bottom container">
        <span>Thoughtful care. Better tomorrows.</span>
        <a href="#statistics" aria-label="Scroll to hospital highlights">SCROLL TO EXPLORE <span>↓</span></a>
        <span className="hero-bottom-right"><HiOutlineClock aria-hidden="true" /> Emergency support, around the clock</span>
      </div>
    </section>
  );
}
