import { HiArrowUpRight, HiOutlineCheckCircle, HiOutlineHeart, HiOutlineShieldCheck } from "react-icons/hi2";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const highlights = [
  { icon: HiOutlineCheckCircle, text: "Experienced, compassionate specialists" },
  { icon: HiOutlineHeart, text: "Care plans shaped around you" },
  { icon: HiOutlineShieldCheck, text: "Modern equipment, thoughtful approach" },
];

export default function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-layout">
        <Reveal className="about-visual">
          <div className="about-image-main">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=84" alt="A member of the Ayra Hospital care team in a modern clinical setting" loading="lazy" />
          </div>
          <div className="about-image-accent"><img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80" alt="" loading="lazy" /></div>
          <div className="experience-badge"><strong>18</strong><span>years of<br />care & trust</span></div>
          <span className="about-image-shape" aria-hidden="true" />
        </Reveal>
        <Reveal className="about-content" delay={0.1}>
          <SectionHeading eyebrow="A better kind of care" title={<>Care for every<br /><span>chapter of life.</span></>} description="At Ayra, we believe feeling cared for is part of getting better. We bring skilled people, thoughtful technology, and a little more time to every conversation." />
          <ul className="about-list">
            {highlights.map(({ icon: Icon, text }) => <li key={text}><Icon aria-hidden="true" />{text}</li>)}
          </ul>
          <a className="button button--primary" href="#contact">Get to know Ayra <HiArrowUpRight aria-hidden="true" /></a>
          <div className="about-footnote"><span className="footnote-line" /> A neighborhood hospital with a heart for people.</div>
        </Reveal>
      </div>
    </section>
  );
}
