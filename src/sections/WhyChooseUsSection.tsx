import { HiArrowUpRight } from "react-icons/hi2";
import { reasons } from "../data/hospital";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function WhyChooseUsSection() {
  return (
    <section className="section why-section">
      <div className="container why-layout">
        <Reveal className="why-intro">
          <SectionHeading eyebrow="The Ayra difference" title={<>Good care is<br /><span>how we care.</span></>} description="Health is personal. Your care should be, too. Here's what you can expect from us." />
          <a className="text-link why-link" href="#appointment">Start with a visit <HiArrowUpRight aria-hidden="true" /></a>
        </Reveal>
        <div className="reasons-grid">
          {reasons.map(({ title, text, icon: Icon }, index) => <Reveal key={title} delay={index * 0.05}><article className="reason-card"><span className="reason-icon"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article></Reveal>)}
        </div>
      </div>
    </section>
  );
}
