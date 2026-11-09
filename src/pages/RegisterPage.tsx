import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { registerPatient } from "../api/client";
import UserAccountForm from "../components/auth/UserAccountForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <div className="login-decoration" aria-hidden="true" />
      <Link to="/" className="brand login-brand"><span className="brand-mark"><img src="/ayra-hospital-heart.svg" alt="" aria-hidden="true" /></span><span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span></Link>
      <section className="login-card login-card--account">
        <Link to="/" className="login-back"><HiArrowLeft /> Back to home</Link>
        <span className="eyebrow">Join the Ayra community</span>
        <h1>Create your<br /><span>Ayra account.</span></h1>
        <p>Complete your profile and choose a password to secure your account.</p>
        <UserAccountForm
          submitLabel="Create User"
          onCancel={() => navigate("/", { replace: true })}
          onSubmit={async (input) => {
            const result = await registerPatient(input);
            return `${result.message} Your account role is ${result.role}. Registration does not automatically sign you in.`;
          }}
        />
        <div className="login-note">Role selection does not grant permissions; some roles require authorization. Already registered? <Link to="/login">Sign in</Link>.</div>
      </section>
      <div className="login-quote">“You deserve care that feels like care.”<span>— The Ayra team</span></div>
    </main>
  );
}
