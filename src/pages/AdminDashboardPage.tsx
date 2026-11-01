import { useState } from "react";
import { HiArrowDownRight, HiArrowRight, HiArrowUpRight, HiOutlineArrowDownTray, HiOutlineCalendarDays, HiOutlineEllipsisHorizontal, HiOutlinePlus, HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi2";
import { adminStats, activityData, appointmentData, patientData } from "../data/adminDashboard";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { DashboardNavItem } from "../components/dashboard/Sidebar";

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
  const [activeItem, setActiveItem] = useState("overview");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredAppointments = appointmentData.filter((appointment) =>
    [appointment.id, appointment.patient, appointment.department, appointment.doctor, appointment.status]
      .some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const filteredPatients = patientData.filter((patient) =>
    [patient.name, patient.email].some((value) => value.toLowerCase().includes(normalizedSearch)),
  );

  function handleNavigate(item: DashboardNavItem) {
    setActiveItem(item.id);
  }

  function showPreviewNotice(action: string) {
    setNotice(`${action} is a preview action. Live hospital records are not connected.`);
  }

  return (
    <DashboardLayout
      title="Good morning, Aarav"
      description="Here's what's happening at your hospital today."
      activeItem={activeItem}
      onNavigate={handleNavigate}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="dashboard-welcome-banner">
        <div className="welcome-copy"><span><HiOutlineSparkles /> SUNDAY, NOVEMBER 1, 2026</span><h2>A healthier day starts with <i>great care.</i></h2><p>Your teams have a full day ahead. Here’s the latest hospital overview.</p></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="welcome-sun" /><div className="welcome-plant welcome-plant--one" /><div className="welcome-plant welcome-plant--two" /><div className="welcome-building"><span /><span /><span /><span /><span /><span /></div></div>
        <span className="welcome-decoration welcome-decoration--one" /><span className="welcome-decoration welcome-decoration--two" />
      </div>
      {notice && <p className="dashboard-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></p>}

      <section className="dashboard-section" id="admin-overview" aria-labelledby="admin-stats-title">
        <div className="dashboard-section-heading-inline"><div><span className="dashboard-overline">YOUR HOSPITAL AT A GLANCE</span><h2 id="admin-stats-title">Today’s overview</h2></div><span className="dashboard-period-label">NOVEMBER 2026</span></div>
        <div className="metrics-grid">{adminStats.map((stat) => <MetricCard key={stat.label} {...stat} />)}</div>
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel appointments-panel" id="admin-appointments" aria-labelledby="appointments-title">
          <SectionTitle eyebrow="SCHEDULE · NOV 1" title="Recent appointments" titleId="appointments-title" action="View schedule" onAction={() => showPreviewNotice("The full schedule")} />
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

      <div className="dashboard-lower-grid">
        <section className="dashboard-panel patients-panel" id="admin-patients" aria-labelledby="patients-title">
          <SectionTitle eyebrow="PATIENT RELATIONSHIPS" title="Recently registered" titleId="patients-title" action="View patients" onAction={() => showPreviewNotice("The patient directory")} />
          <div className="recent-patient-list">{filteredPatients.map((patient) => <article className="recent-patient" key={patient.email}>
            <span className={`table-avatar table-avatar--${patient.color}`}>{patient.initials}</span>
            <span className="recent-patient-info"><strong>{patient.name}</strong><small>{patient.email}</small></span>
            <span className="patient-joined"><strong>{patient.joined}</strong><small>{patient.type}</small></span>
            <button type="button" className="table-more" aria-label={`Actions unavailable for ${patient.name} in preview`} title="Actions are unavailable in preview" disabled><HiOutlineEllipsisHorizontal /></button>
          </article>)}{filteredPatients.length === 0 && <p className="dashboard-empty-state">No patients match “{search}”.</p>}</div>
          <button className="panel-bottom-link panel-bottom-button" onClick={() => showPreviewNotice("The patient directory")}>View patient directory <HiArrowRight /></button>
        </section>

        <section className="dashboard-panel quick-actions-panel" aria-labelledby="quick-actions-title">
          <SectionTitle eyebrow="SHORTCUTS" title="Quick actions" titleId="quick-actions-title" />
          <div className="quick-actions-grid">
            <button type="button" className="quick-action" onClick={() => showPreviewNotice("Adding a patient")}><span className="quick-action-icon quick-action-icon--mint"><HiOutlinePlus /></span><span><strong>Add patient</strong><small>Register a new patient</small></span><HiArrowUpRight /></button>
            <button type="button" className="quick-action" onClick={() => showPreviewNotice("Managing the schedule")}><span className="quick-action-icon quick-action-icon--blue"><HiOutlineCalendarDays /></span><span><strong>Manage schedule</strong><small>Review today's visits</small></span><HiArrowUpRight /></button>
            <button type="button" className="quick-action" onClick={() => showPreviewNotice("Managing staff")}><span className="quick-action-icon quick-action-icon--lavender"><HiOutlineUserGroup /></span><span><strong>Manage staff</strong><small>View your care team</small></span><HiArrowUpRight /></button>
            <button type="button" className="quick-action" onClick={() => showPreviewNotice("Exporting a report")}><span className="quick-action-icon quick-action-icon--peach"><HiOutlineArrowDownTray /></span><span><strong>Export report</strong><small>Download a summary</small></span><HiArrowUpRight /></button>
          </div>
          <p className="quick-actions-note">Actions are previews and are not connected to hospital records.</p>
        </section>
      </div>
    </DashboardLayout>
  );
}
