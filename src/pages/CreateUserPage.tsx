import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiXMark } from "react-icons/hi2";
import { createUser, registrationRoles } from "../api/client";
import UserAccountForm from "../components/auth/UserAccountForm";
import { useAuth } from "../context/AuthContext";

const staffRoles = registrationRoles.filter((role) => role !== "patient");

interface ReturnLocation {
  pathname: string;
  search?: string;
  hash?: string;
}

interface CreateUserLocationState {
  returnTo?: ReturnLocation;
}

export function getCreateUserReturnLocation(state: unknown): ReturnLocation {
  const fallback = { pathname: "/admin/dashboard", search: "", hash: "" };
  if (typeof state !== "object" || state === null || !("returnTo" in state)) return fallback;

  const candidate = state.returnTo;
  if (typeof candidate !== "object" || candidate === null || !("pathname" in candidate)) return fallback;

  const { pathname, search, hash } = candidate as Record<string, unknown>;
  const isAdminDashboardPath = typeof pathname === "string"
    && (pathname === "/admin/dashboard" || pathname.startsWith("/admin/dashboard/"));
  if (
    !isAdminDashboardPath
    || pathname.startsWith("//")
    || (search !== undefined && typeof search !== "string")
    || (hash !== undefined && typeof hash !== "string")
  ) {
    return fallback;
  }
  return {
    pathname,
    search: typeof search === "string" ? search : "",
    hash: typeof hash === "string" ? hash : "",
  };
}

export default function CreateUserPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"patient" | "user">(() => {
    const state = location.state;
    return typeof state === "object" && state !== null && "defaultTab" in state && state.defaultTab === "user"
      ? "user"
      : "patient";
  });
  const [userCreated, setUserCreated] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnTo = useMemo(
    () => getCreateUserReturnLocation(location.state as CreateUserLocationState | null),
    [location.state],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!user || user.role !== "admin") return null;

  function closeDialog() {
    navigate(returnTo, { replace: true });
  }

  function keepFocusInDialog(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusableElements = event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="create-user-modal-backdrop">
      <section className="dashboard-panel create-user-panel create-user-dialog" role="dialog" aria-modal="true" aria-labelledby="create-user-title" onKeyDown={keepFocusInDialog}>
        <div className="create-user-heading">
          <div>
            <span className="dashboard-overline">ACCOUNT MANAGEMENT</span>
            <h2 id="create-user-title">Add a user</h2>
            <p>Add a member of the hospital team. Patient registration will be added separately.</p>
          </div>
          <button ref={closeButtonRef} className="create-user-close" type="button" onClick={closeDialog} aria-label="Close add user form"><HiXMark /></button>
        </div>

        <div className="create-user-tabs" role="tablist" aria-label="Account type">
          <button
            type="button"
            id="create-patient-tab"
            className={activeTab === "patient" ? "create-user-tab is-active" : "create-user-tab"}
            role="tab"
            aria-selected={activeTab === "patient"}
            aria-controls="create-user-tabpanel"
            disabled={userCreated}
            onClick={() => setActiveTab("patient")}
          >
            Patient
          </button>
          <button
            type="button"
            id="create-staff-tab"
            className={activeTab === "user" ? "create-user-tab is-active" : "create-user-tab"}
            role="tab"
            aria-selected={activeTab === "user"}
            aria-controls="create-user-tabpanel"
            disabled={userCreated}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
        </div>
        <div
          id="create-user-tabpanel"
          role="tabpanel"
          aria-labelledby={activeTab === "patient" ? "create-patient-tab" : "create-staff-tab"}
        >
          {activeTab === "patient" ? (
            <div className="patient-registration-placeholder">
              <span className="dashboard-overline">PATIENTS</span>
              <h3>Patient registration is coming later</h3>
              <p>Patient details will be collected through a separate registration feature. No username, email, or password is needed here.</p>
              <button type="button" className="button button--secondary" onClick={closeDialog}>Close</button>
            </div>
          ) : (
            <UserAccountForm
              key="staff"
              submitLabel="Create user"
              roleOptions={staffRoles}
              onCancel={closeDialog}
              onSubmit={async (input) => {
                const result = await createUser(input);
                return `${result.name} added successfully.`;
              }}
              onSuccess={() => setUserCreated(true)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
