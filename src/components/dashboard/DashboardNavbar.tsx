import { useEffect, useRef, useState } from "react";
import { HiBars3, HiOutlineBell, HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import ThemeToggle from "./ThemeToggle";
import UserProfile, { type DashboardUser } from "./UserProfile";

export default function DashboardNavbar({
  user,
  sidebarOpen,
  onToggleSidebar,
  searchValue,
  onSearchChange,
}: {
  user: DashboardUser;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen) searchInputRef.current?.focus();
  }, [mobileSearchOpen]);

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-leading">
        <button className="dashboard-icon-button dashboard-menu-button" type="button" onClick={onToggleSidebar} aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} aria-expanded={sidebarOpen}>
          {sidebarOpen ? <HiXMark /> : <HiBars3 />}
        </button>
        <span className="dashboard-breadcrumb">Workspace <span>/</span> <strong>Overview</strong></span>
      </div>
      <div className="dashboard-topbar-actions">
        <button className="dashboard-icon-button dashboard-search-toggle" type="button" onClick={() => setMobileSearchOpen((open) => !open)} aria-label={mobileSearchOpen ? "Close search" : "Open search"} aria-expanded={mobileSearchOpen}><HiOutlineMagnifyingGlass /></button>
        <label className={`dashboard-search${mobileSearchOpen ? " dashboard-search--open" : ""}`}><HiOutlineMagnifyingGlass /><input ref={searchInputRef} type="search" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search appointments and patients" aria-label="Search appointments and patients" /></label>
        <span className="dashboard-topbar-divider" />
        <span className="dashboard-preview-pill"><span /> Preview data</span>
        <button className="dashboard-icon-button dashboard-notification-button" type="button" aria-label="Notifications (preview only)" title="Notifications are not connected in preview" disabled>
          <HiOutlineBell /><i />
        </button>
        <ThemeToggle />
        <UserProfile user={user} />
      </div>
    </header>
  );
}
