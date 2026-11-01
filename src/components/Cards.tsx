import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HiArrowUpRight, HiCheckCircle, HiXMark } from "react-icons/hi2";
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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      profileButtonRef.current?.focus();
    };
  }, [profileOpen]);

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
          <button ref={profileButtonRef} className="button button--outline button--small" type="button" onClick={() => setProfileOpen(true)}>View profile</button>
          <a className="button button--primary button--small" href="#appointment" aria-label={`Request an appointment with ${doctor.name}`}>Book visit</a>
        </div>
        <span className="doctor-verified"><HiCheckCircle aria-hidden="true" /> Ayra care team</span>
      </div>
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            className="doctor-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setProfileOpen(false);
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <motion.section
              className="doctor-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`doctor-profile-${doctor.initials}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <button ref={closeButtonRef} className="icon-button doctor-modal-close" type="button" onClick={() => setProfileOpen(false)} aria-label="Close doctor profile"><HiXMark /></button>
              <img src={doctor.image} alt="" />
              <span className="doctor-specialty">{doctor.specialty}</span>
              <h2 id={`doctor-profile-${doctor.initials}`}>{doctor.name}</h2>
              <p>{doctor.experience}. Our care team can help you learn more about this specialist and current availability.</p>
              <span className="doctor-modal-availability"><span />{doctor.availability}</span>
              <a className="button button--primary button--full" href="#appointment" onClick={() => setProfileOpen(false)}>Request an appointment <HiArrowUpRight aria-hidden="true" /></a>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
