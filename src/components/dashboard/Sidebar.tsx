import { HiOutlineBuildingOffice2, HiOutlineCalendarDays, HiOutlineChartBar, HiOutlineHome, HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import type { IconType } from "react-icons";
import type { DashboardUser } from "./UserProfile";

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: IconType;
  sectionId?: string;
  badge?: string;
}

export const adminNavigation: DashboardNavItem[] = [
  { id: "overview", label: "Overview", icon: HiOutlineHome, sectionId: "admin-overview" },
  { id: "appointments", label: "Appointments", icon: HiOutlineCalendarDays, sectionId: "admin-appointments", badge: "08" },
  { id: "patients", label: "Patients", icon: HiOutlineUsers, sectionId: "admin-patients" },
  { id: "staff", label: "Staff", icon: HiOutlineUserGroup, badge: "Soon" },
  { id: "departments", label: "Departments", icon: HiOutlineBuildingOffice2, badge: "Soon" },
  { id: "reports", label: "Reports & analytics", icon: HiOutlineChartBar, badge: "Soon" },
];

export default function Sidebar({
  items,
  activeItem,
  onNavigate,
  user,
  isOpen,
  onClose,
}: {
  items: DashboardNavItem[];
  activeItem: string;
  onNavigate: (item: DashboardNavItem) => void;
  user: DashboardUser;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && <button className="dashboard-sidebar-scrim" type="button" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`dashboard-sidebar${isOpen ? " dashboard-sidebar--open" : ""}`} aria-label="Dashboard sidebar">
        <div className="dashboard-sidebar-brand">
          <span className="dashboard-brand-symbol"><HiOutlineBuildingOffice2 /></span>
          <span><strong>ayra</strong><small>CARE ADMIN</small></span>
        </div>
        <div className="sidebar-workspace">
          <span className="workspace-avatar">A</span>
          <span className="workspace-copy"><strong>Ayra Hospital</strong><small>Hospital workspace</small></span>
          <span className="workspace-chevron">⌄</span>
        </div>
        <span className="sidebar-label">WORKSPACE</span>
        <nav className="dashboard-side-nav" aria-label="Dashboard navigation">
          {items.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.badge === "Soon";
            return (
              <button
                key={item.id}
                type="button"
                className={`dashboard-side-link${activeItem === item.id ? " dashboard-side-link--active" : ""}`}
                onClick={() => { if (!isDisabled) onNavigate(item); }}
                aria-current={activeItem === item.id ? "page" : undefined}
                aria-disabled={isDisabled}
                title={isDisabled ? `${item.label} coming soon` : item.label}
              >
                <Icon />
                <span>{item.label}</span>
                {item.badge && <small className={isDisabled ? "side-badge side-badge--soon" : "side-badge"}>{item.badge}</small>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-help-card">
          <span className="help-card-icon">✳</span>
          <strong>Need a hand?</strong>
          <p>Your hospital workspace is in preview mode.</p>
          <a href="mailto:hello@ayrahospital.example">Contact support <span>↗</span></a>
        </div>
        <div className="sidebar-account">
          <span className="dashboard-avatar">{user.initials}</span>
          <span className="sidebar-account-copy"><strong>{user.name}</strong><small>{user.role}</small></span>
          <span className="account-status" title="Preview account" />
        </div>
      </aside>
    </>
  );
}
