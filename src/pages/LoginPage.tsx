import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { signIn } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getRoleDashboardPath } from "../components/auth/RoleDashboardRoutes";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !event.currentTarget.reportValidity()) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    submitting.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn({
        email: String(values.get("email") ?? "").trim(),
        password: String(values.get("password") ?? ""),
      });
      setAuthenticatedUser(result.user);
      form.reset();
      navigate(getRoleDashboardPath(result.user.role), { replace: true });
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
      <Link to="/" className="brand login-brand"><span className="brand-mark"><img src="/ayra-hospital-heart.svg" alt="" aria-hidden="true" /></span><span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span></Link>
      <section className="login-card">
        <Link to="/" className="login-back"><HiArrowLeft /> Back to home</Link>
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to<br /><span>your Ayra account.</span></h1>
        <p>Use the email and password associated with your account. Your sign-in session is held in a secure cookie; it is not saved in browser storage.</p>
        <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>Email address<input type="email" name="email" autoComplete="username" maxLength={254} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" maxLength={72} placeholder="Enter your password" required /></label>
          <button type="submit" className="button button--primary button--full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : <>Sign in <span aria-hidden="true">↗</span></>}
          </button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        <div className="login-note">New to Ayra? <Link to="/register">Create an account</Link>.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
