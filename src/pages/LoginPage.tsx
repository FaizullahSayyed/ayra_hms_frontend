import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiOutlineHeart } from "react-icons/hi2";
import { signIn, type SignInConfirmation } from "../api/client";

export default function LoginPage() {
  const [confirmation, setConfirmation] = useState<SignInConfirmation | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !event.currentTarget.reportValidity()) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    submitting.current = true;
    setIsSubmitting(true);
    setConfirmation(null);
    setError("");

    try {
      const result = await signIn({
        email: String(values.get("email") ?? "").trim(),
        password: String(values.get("password") ?? ""),
      });
      setConfirmation(result);
      form.reset();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Unable to sign in. Please try again.");
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
        <h1>Sign in to<br /><span>your Ayra account.</span></h1>
        <p>Use the email and password associated with your account.</p>
        <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>Email address<input type="email" name="email" autoComplete="username" maxLength={254} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" maxLength={72} placeholder="Enter your password" required /></label>
          <button type="submit" className="button button--primary button--full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : <>Sign in <span aria-hidden="true">↗</span></>}
          </button>
          {confirmation && (
            <p className="form-confirmation" role="status">
              {confirmation.message} Signed in as {confirmation.user.name} ({confirmation.user.role}). This frontend does not yet provide a protected role dashboard.
            </p>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        <div className="login-note">New to Ayra? <Link to="/register">Create an account</Link>.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
