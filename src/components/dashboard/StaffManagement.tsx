import { useEffect, useMemo, useState, type FormEvent } from "react";
import { HiOutlinePencilSquare, HiOutlineArrowPath } from "react-icons/hi2";
import {
  getAdminStaff,
  registrationRoles,
  updateAdminStaffUser,
  type AdminStaffUser,
  type StaffRole,
  type UpdateAdminStaffInput,
} from "../../api/client";

const staffRoles = registrationRoles.filter((role): role is StaffRole => role !== "patient");
type StaffFilter = "all" | StaffRole;
type SignInFilter = "all" | "signed-in" | "signed-out";
type SortKey = "name" | "email" | "role" | "status" | "createdAt";

function displayRole(role: StaffRole) {
  return role[0].toUpperCase() + role.slice(1);
}

function compareStaff(a: AdminStaffUser, b: AdminStaffUser, key: SortKey) {
  if (key === "name") {
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  }
  if (key === "email") return a.email.localeCompare(b.email);
  if (key === "role") return displayRole(a.role).localeCompare(displayRole(b.role));
  if (key === "status") return Number(a.isSignedIn) - Number(b.isSignedIn);
  return Date.parse(a.createdAt) - Date.parse(b.createdAt);
}

export default function StaffManagement({ onAddStaff }: { onAddStaff: () => void }) {
  const [staff, setStaff] = useState<AdminStaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffFilter>("all");
  const [signInFilter, setSignInFilter] = useState<SignInFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAscending, setSortAscending] = useState(true);
  const [editingStaff, setEditingStaff] = useState<AdminStaffUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void getAdminStaff()
      .then((users) => {
        if (active) setStaff(users);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load staff.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const visibleStaff = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return staff
      .filter((member) => roleFilter === "all" || member.role === roleFilter)
      .filter((member) => signInFilter === "all" || member.isSignedIn === (signInFilter === "signed-in"))
      .filter((member) => !normalizedQuery || [
        member.firstName,
        member.lastName,
        member.username,
        member.email,
        displayRole(member.role),
      ].some((value) => value.toLowerCase().includes(normalizedQuery)))
      .sort((a, b) => compareStaff(a, b, sortKey) * (sortAscending ? 1 : -1));
  }, [query, roleFilter, signInFilter, sortAscending, sortKey, staff]);

  function changeSort(key: SortKey) {
    if (sortKey === key) setSortAscending((ascending) => !ascending);
    else {
      setSortKey(key);
      setSortAscending(true);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingStaff || saving) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const roleValue = String(values.get("role") ?? "");
    const role = staffRoles.find((staffRole) => staffRole === roleValue);
    if (!role) {
      setSaveError("Select a valid staff role.");
      return;
    }

    const genderValue = String(values.get("gender") ?? "");
    const gender = genderValue
      ? (["female", "male", "non-binary", "prefer-not-to-say"] as const).find((candidate) => candidate === genderValue)
      : undefined;
    if (genderValue && !gender) {
      setSaveError("Select a valid gender.");
      return;
    }
    const input: UpdateAdminStaffInput = {
      username: String(values.get("username") ?? "").trim(),
      firstName: String(values.get("firstName") ?? "").trim(),
      lastName: String(values.get("lastName") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      role,
      phone: String(values.get("phone") ?? "").trim() || undefined,
      ...(gender ? { gender } : {}),
      ...(String(values.get("password") ?? "") ? { password: String(values.get("password")) } : {}),
    };

    setSaving(true);
    setSaveError("");
    try {
      await updateAdminStaffUser(editingStaff.id, input);
      setEditingStaff(null);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setSaveError(requestError instanceof Error ? requestError.message : "Unable to update this staff account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="dashboard-section staff-management-section" id="admin-staff" aria-labelledby="staff-management-title">
        <div className="dashboard-panel staff-management-panel">
          <div className="staff-management-heading">
            <div>
              <span className="dashboard-overline">USER ACCESS · LIVE</span>
              <h2 id="staff-management-title">Staff management</h2>
              <p>Review staff accounts and whether they are currently signed in. Only administrators can edit account details or passwords.</p>
            </div>
            <button type="button" className="button button--primary button--small" onClick={onAddStaff}>Add staff</button>
          </div>

          <div className="staff-management-tools">
            <label className="staff-search">Search staff
              <input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Name, username, email, or role" />
            </label>
            <label>Role
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.currentTarget.value as StaffFilter)}>
                <option value="all">All roles</option>
                {staffRoles.map((role) => <option value={role} key={role}>{displayRole(role)}</option>)}
              </select>
            </label>
            <label>Sign-in status
              <select value={signInFilter} onChange={(event) => setSignInFilter(event.currentTarget.value as SignInFilter)}>
                <option value="all">All statuses</option>
                <option value="signed-in">Signed in</option>
                <option value="signed-out">Not signed in</option>
              </select>
            </label>
            <button type="button" className="staff-refresh-button" onClick={() => setRefreshKey((key) => key + 1)} disabled={loading} aria-label="Refresh staff list">
              <HiOutlineArrowPath /> Refresh
            </button>
          </div>

          {loading && <p className="dashboard-empty-state" role="status">Loading staff…</p>}
          {!loading && error && <div className="staff-list-error"><p className="form-error" role="alert">{error}</p><button type="button" className="button button--outline button--small" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button></div>}
          {!loading && !error && (
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    {([
                      ["name", "NAME"],
                      ["email", "EMAIL"],
                      ["role", "ROLE"],
                      ["status", "SIGN-IN STATUS"],
                      ["createdAt", "CREATED"],
                    ] as const).map(([key, label]) => (
                      <th key={key} scope="col" aria-sort={sortKey === key ? (sortAscending ? "ascending" : "descending") : "none"}>
                        <button type="button" onClick={() => changeSort(key)}>{label}<span aria-hidden="true">{sortKey === key ? (sortAscending ? " ↑" : " ↓") : " ↕"}</span></button>
                      </th>
                    ))}
                    <th scope="col"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStaff.map((member) => (
                    <tr key={member.id}>
                      <td><strong>{member.firstName} {member.lastName}</strong><small>{member.username}</small></td>
                      <td>{member.email}</td>
                      <td>{displayRole(member.role)}</td>
                      <td><span className={`staff-signin-status${member.isSignedIn ? " is-signed-in" : ""}`}><i />{member.isSignedIn ? "Signed in" : "Not signed in"}</span></td>
                      <td>{Number.isNaN(Date.parse(member.createdAt)) ? "—" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(member.createdAt))}</td>
                      <td><button type="button" className="staff-edit-button" onClick={() => {
                        setSaveError("");
                        setEditingStaff(member);
                      }} aria-label={`Edit ${member.firstName} ${member.lastName}`}><HiOutlinePencilSquare /> Edit</button></td>
                    </tr>
                  ))}
                  {visibleStaff.length === 0 && <tr><td className="dashboard-empty-state" colSpan={6}>{staff.length === 0 ? "No staff accounts found." : "No staff match these filters."}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && <p className="staff-results-count" role="status">Showing {visibleStaff.length} of {staff.length} staff accounts</p>}
        </div>
      </section>

      {editingStaff && (
        <div className="staff-edit-backdrop">
          <section className="staff-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="staff-edit-title">
            <div className="staff-edit-heading">
              <div><span className="dashboard-overline">ADMINISTRATOR ACCESS</span><h2 id="staff-edit-title">Edit staff account</h2></div>
              <button type="button" className="create-user-close" onClick={() => setEditingStaff(null)} aria-label="Close edit form">×</button>
            </div>
            <form className="staff-edit-form" onSubmit={(event) => void handleSave(event)}>
              <label>Username<input name="username" defaultValue={editingStaff.username} maxLength={254} required disabled={saving} /></label>
              <label>Email<input name="email" type="email" defaultValue={editingStaff.email} maxLength={254} required disabled={saving} /></label>
              <label>First name<input name="firstName" defaultValue={editingStaff.firstName} maxLength={80} required disabled={saving} /></label>
              <label>Last name<input name="lastName" defaultValue={editingStaff.lastName} maxLength={80} required disabled={saving} /></label>
              <label>Phone<input name="phone" type="tel" defaultValue={editingStaff.phone} maxLength={32} disabled={saving} /></label>
              <label>Gender
                <select name="gender" defaultValue={editingStaff.gender} disabled={saving}>
                  <option value="">Not specified</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </label>
              <label>Role
                <select name="role" defaultValue={editingStaff.role} disabled={saving}>
                  {staffRoles.map((role) => <option value={role} key={role}>{displayRole(role)}</option>)}
                </select>
              </label>
              <label className="staff-edit-password">Set a new password
                <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} placeholder="Leave blank to keep current password" disabled={saving} />
                <small>Only enter a password if you are changing it. The current password is never shown.</small>
              </label>
              {saveError && <p className="form-error staff-edit-error" role="alert">{saveError}</p>}
              <div className="staff-edit-actions">
                <button type="button" className="button button--secondary" onClick={() => setEditingStaff(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="button button--primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
