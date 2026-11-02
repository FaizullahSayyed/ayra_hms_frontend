import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { registrationRoles, type RegistrationRole } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export function getRoleDashboardPath(role: RegistrationRole): string {
  return `/${role}/dashboard`;
}

export function RoleDashboardRedirect() {
  const { user, status } = useAuth();
  if (status === "loading") return <p className="auth-route-status">Checking your sign-in…</p>;
  if (status === "error") return <SessionCheckError />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboardPath(user.role)} replace />;
}

export function ProtectedRoleDashboard({
  role,
  children,
}: {
  role: RegistrationRole;
  children: ReactNode;
}) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <p className="auth-route-status">Checking your sign-in…</p>;
  if (status === "error") return <SessionCheckError />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== role) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }
  return children;
}

function SessionCheckError() {
  const { error, refreshSession } = useAuth();
  return (
    <main className="auth-route-error">
      <h1>Unable to verify your session</h1>
      <p>{error}</p>
      <button className="button button--primary" type="button" onClick={() => void refreshSession()}>
        Try again
      </button>
    </main>
  );
}

export const roleDashboardRoutes = registrationRoles.map((role) => ({
  role,
  path: getRoleDashboardPath(role),
}));
