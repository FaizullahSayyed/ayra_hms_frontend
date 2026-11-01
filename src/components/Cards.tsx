import { motion, useReducedMotion } from "motion/react";
import { HiArrowUpRight, HiCheckCircle } from "react-icons/hi2";
import type { Doctor, Service } from "../data/hospital";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className="service-card" style={{ "--card-index": index } as React.CSSProperties} whileHover={reduceMotion ? undefined : { y: -5 }} transition={{ duration: 0.2 }}>
      <div className={`service-icon service-icon--${service.tint}`}><Icon aria-hidden="true" /></div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <a className="text-link" href="#appointment" aria-label={`Explore ${service.name} and request an appointment`}>Explore care <HiArrowUpRight aria-hidden="true" /></a>
    </motion.article>
  );
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className="doctor-card" whileHover={reduceMotion ? undefined : { y: -5 }} transition={{ duration: 0.2 }}>
      <div className="doctor-image-wrap">
        <img src={doctor.image} alt={`${doctor.name}, ${doctor.specialty}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <span className="doctor-availability"><span />{doctor.availability}</span>
      </div>
      <div className="doctor-card-content">
        <span className="doctor-specialty">{doctor.specialty}</span>
        <h3>{doctor.name}</h3>
        <p>{doctor.experience}</p>
        <div className="doctor-card-actions">
          <a className="button button--outline button--small" href="#contact">View profile</a>
          <a className="button button--primary button--small" href="#appointment" aria-label={`Request an appointment with ${doctor.name}`}>Book visit</a>
        </div>
        <span className="doctor-verified"><HiCheckCircle aria-hidden="true" /> Ayra care team</span>
      </div>
    </motion.article>
  );
}
