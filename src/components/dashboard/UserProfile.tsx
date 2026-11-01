import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle, HiOutlineChevronDown, HiOutlineUserCircle } from "react-icons/hi2";

export interface DashboardUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export default function UserProfile({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="dashboard-profile" ref={menuRef}>
      <button
        className="dashboard-profile-trigger"
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="dashboard-avatar">{user.initials}</span>
        <span className="dashboard-profile-copy"><strong>{user.name}</strong><small>{user.role}</small></span>
        <HiOutlineChevronDown className={open ? "profile-chevron profile-chevron--open" : "profile-chevron"} />
      </button>
      {open && (
        <div className="dashboard-profile-menu" role="menu">
          <div className="profile-menu-identity"><strong>{user.name}</strong><span>{user.email}</span></div>
          <Link to="/" role="menuitem" onClick={() => setOpen(false)}><HiOutlineUserCircle /> Public website</Link>
          <button type="button" role="menuitem" disabled><HiOutlineArrowRightOnRectangle /> Sign out unavailable in preview</button>
        </div>
      )}
    </div>
  );
}
