import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { ServiceCard } from "../components/Cards";
import { services } from "../data/hospital";

export default function ServicesSection() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Care, your way" title={<>The right care,<br /><span>right when you need it.</span></>} description="From everyday health to specialist support, our connected teams are here for every part of your wellbeing." />
        </Reveal>
        <div className="services-grid" id="departments">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={index % 4 * 0.05}>
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
        </div>
        <div className="services-note"><span className="note-dot" /> Can't find the care you need? <a href="#contact">Talk to our care team <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  );
}
