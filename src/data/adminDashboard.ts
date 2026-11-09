import {
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

export const adminDashboardPreviewNotice =
  "Patient accounts are connected to the backend. Dashboard metrics, appointments, activity, schedule, and other administrative actions are sample data or previews—not clinical records or live hospital operations.";

export interface AdminStat {
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: IconType;
  color: "mint" | "blue" | "lavender" | "peach";
  trend: "up" | "down";
  points: string;
}

export interface AdminAppointment {
  id: string;
  patient: string;
  initials: string;
  color: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "In progress";
}

export const adminStats: AdminStat[] = [
  { label: "Total patients", value: "2,846", change: "+12.8%", comparison: "vs last month", icon: HiOutlineHeart, color: "mint", trend: "up", points: "0,30 18,25 36,28 54,17 72,22 90,11 108,14 126,3" },
  { label: "Medical team", value: "128", change: "+4.2%", comparison: "vs last month", icon: HiOutlineUserGroup, color: "blue", trend: "up", points: "0,27 18,30 36,19 54,23 72,13 90,17 108,8 126,4" },
  { label: "Appointments", value: "384", change: "+8.4%", comparison: "vs last month", icon: HiOutlineCalendarDays, color: "lavender", trend: "up", points: "0,30 18,22 36,27 54,17 72,19 90,12 108,15 126,3" },
  { label: "Monthly revenue", value: "₹8.42L", change: "+6.1%", comparison: "vs last month", icon: HiOutlineCurrencyDollar, color: "peach", trend: "up", points: "0,32 18,28 36,20 54,24 72,14 90,17 108,7 126,4" },
];

export const appointmentData: AdminAppointment[] = [
  { id: "APT-2048", patient: "Ananya Kapoor", initials: "AK", color: "mint", department: "Cardiology", doctor: "Dr. Mehta", date: "Today, Nov 1", time: "09:30 AM", status: "Confirmed" },
  { id: "APT-2047", patient: "Kabir Shah", initials: "KS", color: "blue", department: "Neurology", doctor: "Dr. Shah", date: "Today, Nov 1", time: "10:15 AM", status: "In progress" },
  { id: "APT-2046", patient: "Diya Iyer", initials: "DI", color: "lavender", department: "Pediatrics", doctor: "Dr. Nair", date: "Today, Nov 1", time: "11:00 AM", status: "Pending" },
  { id: "APT-2045", patient: "Rehan Patel", initials: "RP", color: "peach", department: "Orthopedics", doctor: "Dr. Kulkarni", date: "Today, Nov 1", time: "11:30 AM", status: "Confirmed" },
  { id: "APT-2044", patient: "Mira Fernandes", initials: "MF", color: "rose", department: "General medicine", doctor: "Dr. Joshi", date: "Today, Nov 1", time: "12:15 PM", status: "Pending" },
];

export const activityData = [
  { title: "Appointment confirmed", detail: "Dr. Mehta · Cardiology", time: "8 min ago", color: "mint" },
  { title: "New patient registered", detail: "Ishaan Desai", time: "24 min ago", color: "blue" },
  { title: "Invoice payment received", detail: "INV-2024 · ₹2,500", time: "42 min ago", color: "lavender" },
  { title: "Appointment request received", detail: "Pediatrics · Pending review", time: "1 hr ago", color: "peach" },
];
