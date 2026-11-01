import {
  HiOutlineBeaker,
  HiOutlineBolt,
  HiOutlineBuildingOffice2,
  HiOutlineHeart,
  HiOutlineLifebuoy,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import {
  LuBone,
  LuBrain,
  LuBaby,
  LuHeartPulse,
  LuStethoscope,
  LuSmile,
  LuSiren,
  LuSparkles,
} from "react-icons/lu";
import type { IconType } from "react-icons";

export interface Service {
  name: string;
  description: string;
  icon: IconType;
  tint: string;
  department: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  department: string;
  experience: string;
  availability: string;
  image: string;
  initials: string;
}

export const services: Service[] = [
  { name: "Cardiology", description: "Heart care that keeps you moving with confidence.", icon: LuHeartPulse, tint: "blue", department: "Cardiology" },
  { name: "Neurology", description: "Expert support for your brain and nervous system.", icon: LuBrain, tint: "lavender", department: "Neurology" },
  { name: "Orthopedics", description: "Personalized care to help you move freely again.", icon: LuBone, tint: "mint", department: "Orthopedics" },
  { name: "Pediatrics", description: "Thoughtful, compassionate care for growing families.", icon: LuBaby, tint: "peach", department: "Pediatrics" },
  { name: "Dental Care", description: "A healthier smile, supported at every age.", icon: LuSmile, tint: "cyan", department: "Dental Care" },
  { name: "Dermatology", description: "Healthy skin starts with listening and expertise.", icon: LuSparkles, tint: "pink", department: "Dermatology" },
  { name: "Emergency Care", description: "Around-the-clock help when every moment matters.", icon: LuSiren, tint: "rose", department: "Emergency Care" },
  { name: "General Medicine", description: "Your first stop for everyday and lifelong wellness.", icon: LuStethoscope, tint: "sage", department: "General Medicine" },
];

export const doctors: Doctor[] = [
  { name: "Dr. Ananya Mehta", specialty: "Cardiologist", department: "Cardiology", experience: "12 years experience", availability: "Available today", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=720&q=82", initials: "AM" },
  { name: "Dr. Rohan Shah", specialty: "Neurologist", department: "Neurology", experience: "9 years experience", availability: "Next slot · 10:30 AM", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=720&q=82", initials: "RS" },
  { name: "Dr. Priya Nair", specialty: "Pediatrician", department: "Pediatrics", experience: "15 years experience", availability: "Available today", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=720&q=82", initials: "PN" },
];

export const testimonials = [
  {
    name: "Meera Kulkarni",
    detail: "Patient since 2021",
    quote: "From my first appointment, I felt listened to—not rushed. The care team made a difficult time feel manageable, and that made all the difference.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Arjun Desai",
    detail: "Patient since 2023",
    quote: "Booking was simple, the staff were kind, and Dr. Shah explained every step clearly. It is reassuring to have care that feels this personal.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Sara Fernandes",
    detail: "Patient since 2022",
    quote: "The pediatric team cared for our whole family, not just our little one. Every visit has been thoughtful, calm, and genuinely welcoming.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
  },
];

export const reasons = [
  { title: "People who truly listen", text: "Experienced specialists who make time to understand your needs.", icon: HiOutlineUserGroup },
  { title: "Technology with purpose", text: "Modern diagnostics that support more informed care decisions.", icon: HiOutlineBeaker },
  { title: "Here whenever you need us", text: "Our emergency team is ready, day and night.", icon: HiOutlineLifebuoy },
  { title: "Care built around you", text: "A clear, personal care plan—made together, every step.", icon: HiOutlineHeart },
  { title: "Appointments, made easier", text: "Find the right specialist and request a visit in minutes.", icon: HiOutlineUserPlus },
  { title: "Your privacy matters", text: "Your personal information deserves careful protection.", icon: HiOutlineShieldCheck },
];

export const statistics = [
  { value: 50, suffix: "+", label: "Expert doctors", icon: HiOutlineHeart },
  { value: 20, suffix: "+", label: "Medical departments", icon: HiOutlineBuildingOffice2 },
  { value: 10, suffix: "K+", label: "Happy patients", icon: HiOutlineSparkles },
  { value: 24, suffix: "/7", label: "Emergency support", icon: HiOutlineBolt },
];
