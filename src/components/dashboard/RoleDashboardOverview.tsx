import type { RegistrationRole } from "../../api/client";
import { getRoleDashboardInfo } from "../../data/roleDashboards";

export default function RoleDashboardOverview({ role, name }: {
  role: RegistrationRole;
  name: string;
}) {
  const dashboard = getRoleDashboardInfo(role);

  return (
    <section className="role-dashboard-overview" id="role-overview">
      <div className="role-dashboard-welcome">
        <span className="dashboard-overline">{dashboard.label.toUpperCase()} WORKSPACE</span>
        <h2>{dashboard.previewTitle}</h2>
        <p>{dashboard.previewDescription}</p>
        <span className="role-dashboard-greeting">Welcome, {name}</span>
      </div>
      <p className="dashboard-preview-warning" role="note">
        This role-specific page is protected by your verified sign-in session. Its tools and records are previews only; no live hospital data is connected.
      </p>
      <div className="role-dashboard-cards">
        {dashboard.sections.map((section, index) => (
          <article className="role-dashboard-card" key={section}>
            <span className="role-dashboard-card-number">0{index + 1}</span>
            <h2>{section}</h2>
            <p>Preview workspace · Service not connected</p>
            <span className="role-dashboard-card-status">Coming soon</span>
          </article>
        ))}
      </div>
    </section>
  );
}
