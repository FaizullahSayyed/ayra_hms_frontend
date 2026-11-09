import { lazy, Suspense, useEffect, useState } from "react";
import { HiArrowDownRight, HiArrowRight, HiArrowUpRight, HiOutlineArrowDownTray, HiOutlineCalendarDays, HiOutlineEllipsisHorizontal, HiOutlineHome, HiOutlinePlus, HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { getAdminPatients, type PatientAccount } from "../api/client";
import { adminStats, activityData, adminDashboardPreviewNotice, appointmentData } from "../data/adminDashboard";
import { getRoleDashboardInfo } from "../data/roleDashboards";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { DashboardNavItem } from "../components/dashboard/Sidebar";
import RoleDashboardOverview from "../components/dashboard/RoleDashboardOverview";
const StaffManagement = lazy(() => import("../components/dashboard/StaffManagement"));

function MetricCard({ label, value, change, comparison, icon: Icon, color, trend, points }: (typeof adminStats)[number]) {
  const TrendIcon = trend === "up" ? HiArrowUpRight : HiArrowDownRight;
  return (
    <article className="metric-card">
      <div className="metric-topline"><span className={`metric-icon metric-icon--${color}`}><Icon /></span><span className="metric-menu" aria-hidden="true"><HiOutlineEllipsisHorizontal /></span></div>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <div className="metric-bottom"><span className={`metric-change metric-change--${trend}`}><TrendIcon />{change}</span><span>{comparison}</span></div>
      <svg className={`metric-sparkline metric-sparkline--${color}`} viewBox="0 0 126 36" role="img" aria-label={`${label} trend showing ${trend === "up" ? "an increase" : "a decrease"}`}>
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </article>
  );
}

function SectionTitle({ eyebrow, title, titleId, action, onAction }: { eyebrow: string; title: string; titleId?: string; action?: string; onAction?: () => void }) {
  return <div className="dashboard-section-title"><div><span>{eyebrow}</span><h2 id={titleId}>{title}</h2></div>{action && <button type="button" className="dashboard-link-button" onClick={onAction}>{action}<HiArrowRight /></button>}</div>;
}

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("overview");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [patientAccounts, setPatientAccounts] = useState<PatientAccount[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");
  const [patientRefreshKey, setPatientRefreshKey] = useState(0);
  const [signOutError, setSignOutError] = useState("");
  const [signOutPending, setSignOutPending] = useState(false);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredAppointments = appointmentData.filter((appointment) =>
    [appointment.id, appointment.patient, appointment.department, appointment.doctor, appointment.status]
      .some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const filteredPatients = patientAccounts.filter((patient) =>
    [patient.name, patient.email].some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const routeState = location.state as { userCreatedMessage?: unknown } | null;
  const userCreatedMessage = typeof routeState?.userCreatedMessage === "string"
    ? routeState.userCreatedMessage
    : "";

  useEffect(() => {
    if (user?.role !== "admin") {
      setPatientsLoading(false);
      return;
    }

    let active = true;
    setPatientsLoading(true);
    setPatientsError("");
    void getAdminPatients()
      .then((patients) => {
        if (active) setPatientAccounts(patients);
      })
      .catch((error: unknown) => {
        if (active) {
          setPatientsError(error instanceof Error ? error.message : "Unable to load patient accounts.");
        }
      })
      .finally(() => {
        if (active) setPatientsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.role, patientRefreshKey]);

  function handleNavigate(item: DashboardNavItem) {
    setActiveItem(item.id);
  }

  function showPreviewNotice(action: string) {
    setNotice(`${action} is a preview action. Live hospital records are not connected.`);
  }

  function navigateToCreateUser(defaultTab: "patient" | "user" = "patient") {
    navigate("/admin/users/new", {
      state: {
        defaultTab,
        returnTo: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
      },
    });
  }

  function navigateToStaff() {
    setActiveItem("staff");
    document.getElementById("admin-staff")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!user) return null;

  const roleInfo = getRoleDashboardInfo(user.role);
  const firstName = user.name.trim().split(/\s+/)[0] || roleInfo.label;
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const dashboardUser = {
    name: user.name,
    email: user.email,
    role: roleInfo.label,
    initials,
  };
  const navigationItems = user.role === "admin"
    ? undefined
    : [{
      id: "overview",
      label: "Overview",
      icon: HiOutlineHome,
      sectionId: "role-overview",
    }];

  async function handleSignOut() {
    setSignOutPending(true);
    setSignOutError("");
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    } finally {
      setSignOutPending(false);
    }
  }

  return (
    <DashboardLayout
      role={user.role}
      roleLabel={roleInfo.label}
      user={dashboardUser}
      title={user.role === "admin" ? `Good morning, ${firstName}` : `${roleInfo.title} · ${firstName}`}
      description={roleInfo.description}
      activeItem={activeItem}
      onNavigate={handleNavigate}
      navigationItems={navigationItems}
      searchValue={search}
      onSearchChange={setSearch}
      onSignOut={() => void handleSignOut()}
      signOutPending={signOutPending}
    >
      {signOutError && <p className="form-error dashboard-signout-error" role="alert">{signOutError}</p>}
      {user.role === "admin" ? (
      <>
      {userCreatedMessage && (
        <p className="dashboard-success-toast" role="status">
          {userCreatedMessage}
          <button type="button" onClick={() => navigate(location.pathname, { replace: true, state: null })} aria-label="Dismiss confirmation">×</button>
        </p>
      )}
      <p className="dashboard-preview-warning" role="note">{adminDashboardPreviewNotice}</p>
      <div className="dashboard-welcome-banner">
        <div className="welcome-copy"><span><HiOutlineSparkles /> DASHBOARD PREVIEW · SAMPLE DATA</span><h2>A healthier day starts with <i>great care.</i></h2><p>This dashboard preview is not connected to live hospital operations.</p></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="welcome-sun" /><div className="welcome-plant welcome-plant--one" /><div className="welcome-plant welcome-plant--two" /><div className="welcome-building"><span /><span /><span /><span /><span /><span /></div></div>
        <span className="welcome-decoration welcome-decoration--one" /><span className="welcome-decoration welcome-decoration--two" />
      </div>
      {notice && <p className="dashboard-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></p>}

      <section className="dashboard-panel quick-actions-panel quick-actions-panel--top" aria-labelledby="quick-actions-title">
        <SectionTitle eyebrow="SHORTCUTS" title="Quick actions" titleId="quick-actions-title" />
        <div className="quick-actions-grid">
          <button type="button" className="quick-action" onClick={() => navigateToCreateUser()}><span className="quick-action-icon quick-action-icon--mint"><HiOutlinePlus /></span><span><strong>Add user</strong><small>Create a staff account</small></span><HiArrowUpRight /></button>
          <button type="button" className="quick-action" onClick={() => showPreviewNotice("Managing the schedule")}><span className="quick-action-icon quick-action-icon--blue"><HiOutlineCalendarDays /></span><span><strong>Manage schedule</strong><small>Review today's visits</small></span><HiArrowUpRight /></button>
          <button type="button" className="quick-action" onClick={navigateToStaff}><span className="quick-action-icon quick-action-icon--lavender"><HiOutlineUserGroup /></span><span><strong>Manage staff</strong><small>View your care team</small></span><HiArrowUpRight /></button>
          <button type="button" className="quick-action" onClick={() => showPreviewNotice("Exporting a report")}><span className="quick-action-icon quick-action-icon--peach"><HiOutlineArrowDownTray /></span><span><strong>Export report</strong><small>Download a summary</small></span><HiArrowUpRight /></button>
        </div>
        <p className="quick-actions-note">Staff account management is live. Patient registration will be added separately; schedule and report actions are previews.</p>
      </section>

      <section className="dashboard-section" id="admin-overview" aria-labelledby="admin-stats-title">
        <div className="dashboard-section-heading-inline"><div><span className="dashboard-overline">SAMPLE DATA · PREVIEW</span><h2 id="admin-stats-title">Today’s overview</h2></div><span className="dashboard-period-label">SAMPLE</span></div>
        <div className="metrics-grid">{adminStats.map((stat) => <MetricCard key={stat.label} {...stat} />)}</div>
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel appointments-panel" id="admin-appointments" aria-labelledby="appointments-title">
          <SectionTitle eyebrow="SAMPLE SCHEDULE · PREVIEW" title="Recent appointments" titleId="appointments-title" action="View schedule" onAction={() => showPreviewNotice("The full schedule")} />
          <div className="appointments-table-wrap">
            <table className="appointments-table">
              <thead><tr><th scope="col">PATIENT</th><th scope="col">DEPARTMENT</th><th scope="col">DATE & TIME</th><th scope="col">STATUS</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{filteredAppointments.map((appointment) => <tr key={appointment.id}>
                <td><div className="table-patient"><span className={`table-avatar table-avatar--${appointment.color}`}>{appointment.initials}</span><span><strong>{appointment.patient}</strong><small>{appointment.id}</small></span></div></td>
                <td><span className="department-cell">{appointment.department}<small>{appointment.doctor}</small></span></td>
                <td><span className="date-cell">{appointment.date}<small>{appointment.time}</small></span></td>
                <td><span className={`appointment-status appointment-status--${appointment.status.toLowerCase().replace(" ", "-")}`}><i />{appointment.status}</span></td>
                <td><button className="table-more" type="button" aria-label={`Actions unavailable for ${appointment.patient}'s appointment in preview`} title="Actions are unavailable in preview" disabled><HiOutlineEllipsisHorizontal /></button></td>
              </tr>)}{filteredAppointments.length === 0 && <tr><td className="dashboard-empty-state" colSpan={5}>No appointments match “{search}”.</td></tr>}</tbody>
            </table>
          </div>
          <button className="panel-bottom-link panel-bottom-button" onClick={() => showPreviewNotice("The full appointment list")}>View all appointments <HiArrowRight /></button>
        </section>

        <section className="dashboard-panel activity-panel" id="admin-activity" aria-labelledby="activity-title">
          <SectionTitle eyebrow="HOSPITAL FEED · SAMPLE" title="Recent activity" titleId="activity-title" />
          <ol className="activity-list">{activityData.map((activity, index) => <li className="activity-item" key={activity.title}>
            <span className={`activity-icon activity-icon--${activity.color}`}><span /></span>
            <span className="activity-copy"><strong>{activity.title}</strong><small>{activity.detail}</small><time>{activity.time}</time></span>
            {index < activityData.length - 1 && <span className="activity-line" aria-hidden="true" />}
          </li>)}</ol>
          <button className="panel-bottom-link panel-bottom-button" type="button" onClick={() => showPreviewNotice("The activity log")}>View activity log <HiArrowRight /></button>
        </section>
      </div>

      <div className="dashboard-patients-row">
        <section className="dashboard-panel patients-panel" id="admin-patients" aria-labelledby="patients-title">
          <SectionTitle eyebrow="PATIENT ACCOUNTS · LIVE" title="Recently added patient accounts" titleId="patients-title" action="Add user" onAction={navigateToCreateUser} />
          <div className="recent-patient-list">
            {patientsLoading && <p className="dashboard-empty-state" role="status">Loading patient accounts…</p>}
            {!patientsLoading && patientsError && (
              <div className="dashboard-empty-state">
                <p className="form-error" role="alert">{patientsError}</p>
                <button type="button" className="button button--outline button--small" onClick={() => setPatientRefreshKey((key) => key + 1)}>Retry</button>
              </div>
            )}
            {!patientsLoading && !patientsError && filteredPatients.map((patient, index) => {
              const initials = patient.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
              const joined = new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(patient.createdAt));
              const colors = ["blue", "lavender", "mint", "peach", "rose"] as const;
              return <article className="recent-patient" key={patient.id}>
                <span className={`table-avatar table-avatar--${colors[index % colors.length]}`}>{initials}</span>
                <span className="recent-patient-info"><strong>{patient.name}</strong><small>{patient.email}</small></span>
                <span className="patient-joined"><strong>{joined}</strong><small>Patient account</small></span>
              </article>;
            })}
            {!patientsLoading && !patientsError && filteredPatients.length === 0 && (
              <p className="dashboard-empty-state">
                {patientAccounts.length === 0 ? "No patient accounts yet." : `No patients match “${search}”.`}
              </p>
            )}
          </div>
          <button className="panel-bottom-link panel-bottom-button" onClick={() => navigateToCreateUser()}>Add a user <HiArrowRight /></button>
        </section>
      </div>
      <Suspense fallback={<p className="dashboard-empty-state" role="status">Loading staff management…</p>}>
        <StaffManagement onAddStaff={() => navigateToCreateUser("user")} />
      </Suspense>
      </>
      ) : (
        <RoleDashboardOverview role={user.role} name={user.name} />
      )}
    </DashboardLayout>
  );
}
