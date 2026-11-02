import type { RegistrationRole } from "../api/client";

export interface RoleDashboardInfo {
  label: string;
  title: string;
  description: string;
  previewTitle: string;
  previewDescription: string;
  sections: readonly [string, string, string];
}

export const roleDashboardInfo: Record<RegistrationRole, RoleDashboardInfo> = {
  patient: {
    label: "Patient",
    title: "My care",
    description: "A personal space for your care journey.",
    previewTitle: "Your care, all in one place.",
    previewDescription: "Your patient workspace is ready for secure care tools.",
    sections: ["Appointments", "Care team", "My details"],
  },
  biller: {
    label: "Biller",
    title: "Billing workspace",
    description: "A focused workspace for hospital billing tasks.",
    previewTitle: "Billing, made clearer.",
    previewDescription: "Your billing workspace is ready for approved finance tools.",
    sections: ["Billing overview", "Invoices", "Payment support"],
  },
  receptionist: {
    label: "Receptionist",
    title: "Front desk",
    description: "A welcoming workspace for patient coordination.",
    previewTitle: "The front desk starts here.",
    previewDescription: "Your reception workspace is ready for approved coordination tools.",
    sections: ["Front desk overview", "Patient check-in", "Visit coordination"],
  },
  nurse: {
    label: "Nurse",
    title: "Nursing station",
    description: "A clear workspace for nursing workflows.",
    previewTitle: "Care coordination at a glance.",
    previewDescription: "Your nursing workspace is ready for approved clinical tools.",
    sections: ["Nursing overview", "Care tasks", "Team handoff"],
  },
  doctor: {
    label: "Doctor",
    title: "Clinical workspace",
    description: "A dedicated workspace for your clinical day.",
    previewTitle: "Your clinical day, organized.",
    previewDescription: "Your doctor workspace is ready for approved clinical tools.",
    sections: ["Clinical overview", "Schedule", "Care coordination"],
  },
  admin: {
    label: "Administrator",
    title: "Hospital overview",
    description: "A high-level preview of your hospital workspace.",
    previewTitle: "A healthier day starts with great care.",
    previewDescription: "Your administrator workspace is ready for approved hospital tools.",
    sections: ["Hospital overview", "Operations", "Reports"],
  },
};

export function getRoleDashboardInfo(role: RegistrationRole): RoleDashboardInfo {
  return roleDashboardInfo[role];
}
