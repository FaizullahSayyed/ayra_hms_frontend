import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import {
  ProtectedRoleDashboard,
  RoleDashboardRedirect,
  roleDashboardRoutes,
} from "./components/auth/RoleDashboardRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<RoleDashboardRedirect />} />
      {roleDashboardRoutes.map(({ role, path }) => (
        <Route
          key={role}
          path={path}
          element={(
            <ProtectedRoleDashboard role={role}>
              <AdminDashboardPage />
            </ProtectedRoleDashboard>
          )}
        />
      ))}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
