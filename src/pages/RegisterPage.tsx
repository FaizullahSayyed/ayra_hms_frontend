import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { registerPatient, registrationRoles, type RegistrationRole } from "../api/client";

export default function RegisterPage() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<RegistrationRole>("patient");
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !event.currentTarget.reportValidity()) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get("password") ?? "");
    const confirmPasswordInput = form.elements.namedItem("confirmPassword");
    if (!(confirmPasswordInput instanceof HTMLInputElement)) {
      throw new Error("Registration form confirmation field is missing.");
    }
    confirmPasswordInput.setCustomValidity(
      password !== confirmPasswordInput.value ? "Passwords do not match." : "",
    );
    if (!form.reportValidity()) return;

    submitting.current = true;
    setIsSubmitting(true);
    setConfirmation("");
    setError("");
    try {
      const result = await registerPatient({
        name: String(values.get("name") ?? "").trim(),
        email: String(values.get("email") ?? "").trim(),
        password,
        role,
      });
      setConfirmation(`${result.message} Your account role is ${result.role}. Registration does not automatically sign you in.`);
      form.reset();
      setRole("patient");
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Unable to register. Please try again.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-decoration" aria-hidden="true" />
      <Link to="/" className="brand login-brand"><span className="brand-mark"><img src="/ayra-hospital-heart.svg" alt="" aria-hidden="true" /></span><span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span></Link>
      <section className="login-card">
        <Link to="/" className="login-back"><HiArrowLeft /> Back to home</Link>
        <span className="eyebrow">Join the Ayra community</span>
        <h1>Create your<br /><span>Ayra account.</span></h1>
        <p>Register your account. Your password is sent to the registration service only when you submit and is never stored in this app.</p>
        <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>Full name<input type="text" name="name" autoComplete="name" minLength={2} maxLength={150} placeholder="Your full name" required /></label>
          <label>Email address<input type="email" name="email" autoComplete="email" maxLength={255} placeholder="you@example.com" required /></label>
          <label>Account role<select name="role" value={role} onChange={(changeEvent) => {
            const selectedRole = registrationRoles.find((option) => option === changeEvent.target.value);
            if (selectedRole) setRole(selectedRole);
          }} required>{registrationRoles.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label>Password<input type="password" name="password" autoComplete="new-password" minLength={8} maxLength={72} placeholder="At least 8 characters" onChange={(changeEvent) => {
            const confirmInput = changeEvent.currentTarget.form?.elements.namedItem("confirmPassword");
            if (confirmInput instanceof HTMLInputElement) confirmInput.setCustomValidity("");
          }} required /></label>
          <label>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} maxLength={72} placeholder="Enter your password again" onChange={(changeEvent) => changeEvent.currentTarget.setCustomValidity("")} required /></label>
          <button type="submit" className="button button--primary button--full" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : <>Create account <span aria-hidden="true">↗</span></>}</button>
          {confirmation && <p className="form-confirmation" role="status">{confirmation}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        <div className="login-note">Role selection does not grant permissions; some roles require authorization. Already registered? <Link to="/login">Sign in</Link>.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
