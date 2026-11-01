import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiOutlineHeart } from "react-icons/hi2";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setMessage("Patient sign-in is a preview only and is not connected to an account service.");
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
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" minLength={6} placeholder="Enter your password" required /></label>
          <button type="submit" className="button button--primary button--full">Continue <span aria-hidden="true">↗</span></button>
          {message && <p className="form-confirmation" role="status">{message}</p>}
        </form>
        <div className="login-note">Patient portal preview · No credentials are transmitted or stored.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
