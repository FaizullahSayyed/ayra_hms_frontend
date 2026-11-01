import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar, { adminNavigation, type DashboardNavItem } from "./Sidebar";
import type { DashboardUser } from "./UserProfile";

const previewAdmin: DashboardUser = {
  name: "Aarav Mehta",
  email: "admin.preview@ayrahospital.example",
  role: "Hospital administrator · Preview",
  initials: "AM",
};

export default function DashboardLayout({
  children,
  title,
  description,
  activeItem,
  onNavigate,
  navigationItems = adminNavigation,
  user = previewAdmin,
  searchValue,
  onSearchChange,
}: {
  children: ReactNode;
  title: string;
  description: string;
  activeItem: string;
  onNavigate: (item: DashboardNavItem) => void;
  navigationItems?: DashboardNavItem[];
  user?: DashboardUser;
  searchValue: string;
  onSearchChange: (value: string) => void;
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
      navigate(`/admin/dashboard/${item.id}`);
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar
        items={navigationItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        user={user}
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
            <div><span className="dashboard-eyebrow">AYRA HOSPITAL <i /> ADMIN WORKSPACE</span><h1>{title}</h1><p>{description}</p></div>
            <div className="dashboard-heading-actions"><span className="dashboard-date"><span>◷</span> Sunday, November 1</span></div>
          </div>
          {children}
          <footer className="dashboard-footer"><span>Ayra Hospital · Admin preview</span><span>Sample data only · Not connected to live hospital records</span></footer>
        </main>
      </div>
    </div>
  );
}
