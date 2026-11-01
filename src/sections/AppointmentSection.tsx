import { useMemo, useState, type FormEvent } from "react";
import { HiArrowUpRight, HiOutlineCalendarDays, HiOutlineShieldCheck } from "react-icons/hi2";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { doctors, services } from "../data/hospital";

const times = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

function getToday() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function AppointmentSection() {
  const [department, setDepartment] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const filteredDoctors = useMemo(() => doctors.filter((doctor) => !department || doctor.department === department), [department]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phoneInput = form.elements.namedItem("phone");
    if (!(phoneInput instanceof HTMLInputElement)) throw new Error("Appointment form phone input is missing.");
    const digitCount = phoneInput.value.replace(/\D/g, "").length;
    phoneInput.setCustomValidity(
      digitCount < 8 || digitCount > 15 ? "Enter a phone number with 8 to 15 digits." : "",
    );
    if (!form.reportValidity()) return;
    setConfirmation("Your demo request is ready. No appointment has been booked; please call our care team to confirm a real visit.");
    form.reset();
    setDepartment("");
  }

  return (
    <section className="section appointment-section" id="appointment">
      <div className="appointment-wash" aria-hidden="true" />
      <div className="container appointment-layout">
        <Reveal className="appointment-copy">
          <SectionHeading eyebrow="A good first step" title={<>Let's find a time<br /><span>that works for you.</span></>} description="Tell us what you need and our care team will help you find the right next step." />
          <div className="appointment-promise"><span><HiOutlineCalendarDays aria-hidden="true" /></span><div><strong>Simple, thoughtful care</strong><p>Share a few details to prepare a sample appointment request.</p></div></div>
          <div className="appointment-promise"><span><HiOutlineShieldCheck aria-hidden="true" /></span><div><strong>Your information stays yours</strong><p>This demo does not send or store your personal details.</p></div></div>
          <div className="appointment-callout"><span className="callout-line" /><p>Need urgent help?<br /><a href="tel:+912240009999">Call emergency support <HiArrowUpRight aria-hidden="true" /></a></p></div>
        </Reveal>
        <Reveal className="appointment-form-wrap" delay={0.12}>
          <div className="form-card">
            <div className="form-card-heading"><span className="form-step">01 <span>/ 01</span></span><h3>Request a visit</h3><p>All fields are required for this demo request.</p></div>
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Full name<input name="name" type="text" placeholder="e.g. Aanya Patel" autoComplete="name" minLength={2} required /></label>
                <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
              </div>
              <div className="form-row">
                <label>Phone number<input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" onChange={(event) => event.currentTarget.setCustomValidity("")} required /></label>
                <label>Department<select name="department" value={department} onChange={(event) => setDepartment(event.target.value)} required><option value="">Choose department</option>{services.map((service) => <option key={service.department} value={service.department}>{service.department}</option>)}</select></label>
              </div>
              <div className="form-row">
                <label>Preferred doctor<select name="doctor" defaultValue="" required><option value="">Choose a doctor</option><option value="any">No preference — care team will match you</option>{filteredDoctors.map((doctor) => <option key={doctor.name} value={doctor.name}>{doctor.name} · {doctor.specialty}</option>)}</select></label>
                <label>Preferred date<input name="date" type="date" min={getToday()} required /></label>
              </div>
              <label>Preferred time<select name="time" defaultValue="" required><option value="">Choose a time</option>{times.map((time) => <option key={time}>{time}</option>)}</select></label>
              <button className="button button--primary button--full" type="submit">Prepare demo request <HiArrowUpRight aria-hidden="true" /></button>
              <p className="form-privacy"><HiOutlineShieldCheck aria-hidden="true" /> Demo only — no appointment is booked or information submitted.</p>
              {confirmation && <p className="form-confirmation" role="status">{confirmation}</p>}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
