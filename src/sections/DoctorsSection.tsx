import { HiArrowUpRight } from "react-icons/hi2";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { DoctorCard } from "../components/Cards";
import { doctors, type Doctor } from "../data/hospital";

export default function DoctorsSection({
  onRequestAppointment,
}: {
  onRequestAppointment: (doctor: Doctor) => void;
}) {
  return (
    <section className="section doctors-section" id="doctors">
      <div className="container">
        <div className="section-row">
          <Reveal><SectionHeading eyebrow="Meet your care team" title={<>Good people.<br /><span>Great care.</span></>} description="Meet a few of the specialists who bring skill, kindness, and a personal touch to every visit." /></Reveal>
          <Reveal delay={0.1}><a className="button button--outline doctors-all" href="#contact">Meet all our doctors <HiArrowUpRight aria-hidden="true" /></a></Reveal>
        </div>
        <div className="doctors-grid">
          {doctors.map((doctor, index) => <Reveal key={doctor.name} delay={index * 0.08}><DoctorCard doctor={doctor} onRequestAppointment={onRequestAppointment} /></Reveal>)}
        </div>
        <div className="doctors-disclaimer">Doctor profiles shown for demonstration. Please contact our care team to confirm current availability.</div>
      </div>
    </section>
  );
}
