import { useState, type FormEvent } from "react";
import { HiOutlineClipboardDocument, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import {
  registrationRoles,
  type PatientGender,
  type RegistrationRole,
  type UserAccountInput,
} from "../../api/client";

const genderOptions: { value: PatientGender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export default function UserAccountForm({
  submitLabel,
  fixedRole,
  roleOptions: availableRoles,
  onCancel,
  onSubmit,
  onSuccess,
}: {
  submitLabel: string;
  fixedRole?: RegistrationRole;
  roleOptions?: readonly RegistrationRole[];
  onCancel: () => void;
  onSubmit: (input: UserAccountInput) => Promise<string>;
  onSuccess?: (confirmation: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordCopyMessage, setPasswordCopyMessage] = useState("");
  const roleOptions = availableRoles ?? registrationRoles;
  const defaultRole = roleOptions.includes("patient")
    ? "patient"
    : roleOptions.length === 1
      ? roleOptions[0]
      : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || confirmation) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const genderValue = String(values.get("gender") ?? "");
    const gender = genderOptions.find((option) => option.value === genderValue)?.value;
    const roleValue = String(values.get("role") ?? "");
    const role = fixedRole ?? roleOptions.find((option) => option === roleValue);
    if (!gender || !role) {
      setError("Select a valid gender and role.");
      return;
    }

    const input: UserAccountInput = {
      username: String(values.get("username") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      firstName: String(values.get("firstName") ?? "").trim(),
      lastName: String(values.get("lastName") ?? "").trim(),
      password,
      phone: String(values.get("phone") ?? "").trim() || undefined,
      gender,
      role,
    };

    setSubmitting(true);
    setError("");
    try {
      const result = await onSubmit(input);
      setConfirmation(result);
      onSuccess?.(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create the account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setPasswordCopyMessage("Password copied.");
    } catch {
      setPasswordCopyMessage("Clipboard access is unavailable. Select and copy the password manually.");
    }
  }

  const disabled = submitting || Boolean(confirmation);

  return (
    <form className="user-account-form" onSubmit={(event) => void handleSubmit(event)} aria-busy={submitting}>
      <label>Username <span aria-hidden="true">*</span>
        <input name="username" type="text" autoComplete="username" maxLength={254} placeholder="admin@hospital.com" required disabled={disabled} />
      </label>
      <label>Email <span aria-hidden="true">*</span>
        <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required disabled={disabled} />
      </label>
      <label>First name <span aria-hidden="true">*</span>
        <input name="firstName" type="text" autoComplete="given-name" minLength={1} maxLength={80} required disabled={disabled} />
      </label>
      <label>Last name <span aria-hidden="true">*</span>
        <input name="lastName" type="text" autoComplete="family-name" minLength={1} maxLength={80} required disabled={disabled} />
      </label>
      <label className="user-password-field">Password <span aria-hidden="true">*</span>
        <span className="user-password-control">
          <input name="password" type={passwordVisible ? "text" : "password"} value={password} onChange={(event) => {
            setPassword(event.currentTarget.value);
            setPasswordCopyMessage("");
          }} autoComplete="new-password" minLength={12} maxLength={128} required aria-describedby="password-requirements" disabled={disabled} />
          <button type="button" className="user-password-action" onClick={() => setPasswordVisible((visible) => !visible)} disabled={disabled} aria-label={passwordVisible ? "Hide password" : "Show password"}>
            {passwordVisible ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
          </button>
          <button type="button" className="user-password-action" onClick={() => void copyPassword()} disabled={disabled || !password} aria-label="Copy password">
            <HiOutlineClipboardDocument />
          </button>
        </span>
        <small id="password-requirements">Choose a password with at least 12 characters.</small>
      </label>
      <label>Phone
        <input name="phone" type="tel" autoComplete="tel" maxLength={32} placeholder="Optional" disabled={disabled} />
      </label>
      <label>Gender <span aria-hidden="true">*</span>
        <select name="gender" defaultValue="" required disabled={disabled}>
          <option value="" disabled>Select gender</option>
          {genderOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      {fixedRole
        ? <label>Role <input type="text" value={fixedRole[0].toUpperCase() + fixedRole.slice(1)} readOnly /></label>
        : <label>Role <span aria-hidden="true">*</span>
          <select name="role" defaultValue={defaultRole} required disabled={disabled}>
            {defaultRole === "" && <option value="" disabled>Select role</option>}
            {roleOptions.map((role: RegistrationRole) => <option value={role} key={role}>{role[0].toUpperCase() + role.slice(1)}</option>)}
          </select>
        </label>}
      {passwordCopyMessage && <p className="user-account-copy-message" role="status">{passwordCopyMessage}</p>}
      {confirmation && <p className="form-confirmation user-account-message" role="status">{confirmation} Your password was set during registration.</p>}
      {error && <p className="form-error user-account-message" role="alert">{error}</p>}
      <div className="user-account-actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="button button--primary" disabled={disabled}>
          {submitting ? "Creating user…" : confirmation ? "User created" : submitLabel}
        </button>
      </div>
    </form>
  );
}
