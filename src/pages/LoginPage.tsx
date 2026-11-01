import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiOutlineHeart } from "react-icons/hi2";
import { requestPatientLogin } from "../api/client";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !event.currentTarget.reportValidity()) return;

    submitting.current = true;
    setIsSubmitting(true);
    setMessage("");
    try {
      await requestPatientLogin();
      setMessage("Patient sign-in is not configured. No credentials were sent.");
    } catch (loginError) {
      setMessage(loginError instanceof Error ? loginError.message : "Patient sign-in is not configured. No credentials were sent.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-decoration" aria-hidden="true" />
      <Link to="/" className="brand login-brand"><span className="brand-mark"><HiOutlineHeart /></span><span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span></Link>
      <section className="login-card">
        <Link to="/" className="login-back"><HiArrowLeft /> Back to home</Link>
        <span className="eyebrow">Welcome back</span>
        <h1>Your care,<br /><span>all in one place.</span></h1>
        <p>Sign in to your patient portal to keep your care journey close.</p>
        <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" minLength={6} placeholder="Enter your password" required /></label>
          <button type="submit" className="button button--primary button--full" disabled={isSubmitting}>{isSubmitting ? "Checking…" : <>Continue <span aria-hidden="true">↗</span></>}</button>
          {message && <p className="form-error" role="alert">{message}</p>}
        </form>
        <div className="login-note">Patient login is not configured. No credentials are transmitted or stored.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
