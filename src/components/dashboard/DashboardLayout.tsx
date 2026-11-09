import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { RegistrationRole } from "../../api/client";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar, { adminNavigation, type DashboardNavItem } from "./Sidebar";
import type { DashboardUser } from "./UserProfile";

export default function DashboardLayout({
  children,
  role,
  roleLabel,
  title,
  description,
  activeItem,
  onNavigate,
  navigationItems = adminNavigation,
  user,
  searchValue,
  onSearchChange,
  onSignOut,
  signOutPending = false,
}: {
  children: ReactNode;
  role: RegistrationRole;
  roleLabel: string;
  title: string;
  description: string;
  activeItem: string;
  onNavigate: (item: DashboardNavItem) => void;
  navigationItems?: DashboardNavItem[];
  user: DashboardUser;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSignOut: () => void;
  signOutPending?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  function handleNavigate(item: DashboardNavItem) {
    onNavigate(item);
    setSidebarOpen(false);
    if (item.sectionId) {
      document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/${role}/dashboard/${item.id}`);
    }
  }

  return (
    <div className="dashboard-shell" data-role={role}>
      <Sidebar
        items={navigationItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        user={user}
        roleLabel={roleLabel}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="dashboard-main">
        <DashboardNavbar
          user={user}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <main className="dashboard-content">
          <div className="dashboard-page-heading">
            <div><span className="dashboard-eyebrow">AYRA HOSPITAL <i /> {roleLabel.toUpperCase()} WORKSPACE</span><h1>{title}</h1><p>{description}</p></div>
            <div className="dashboard-heading-actions">
              <span className="dashboard-date"><span>◷</span> {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date())}</span>
              <button className="button button--outline button--small dashboard-signout" type="button" onClick={onSignOut} disabled={signOutPending}>
                {signOutPending ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
          {children}
          <footer className="dashboard-footer"><span>Ayra Hospital · {roleLabel} workspace</span><span>{role === "admin" ? "Patient accounts are live · Other dashboard data is a preview" : "Dashboard information may include preview data"}</span></footer>
        </main>
      </div>
    </div>
  );
}
