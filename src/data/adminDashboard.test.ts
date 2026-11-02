import { describe, expect, it } from "vitest";
import {
  activityData,
  adminDashboardPreviewNotice,
  adminStats,
  appointmentData,
  patientData,
} from "./adminDashboard";

describe("admin dashboard preview boundary", () => {
  it("distinguishes verified admin routing from sample data and unimplemented live records", () => {
    expect(adminDashboardPreviewNotice).toMatch(/session and admin role were verified by the backend/i);
    expect(adminDashboardPreviewNotice).toMatch(/dashboard content is sample data only/i);
    expect(adminDashboardPreviewNotice).toMatch(/live hospital records and admin actions are not connected/i);
  });

  it("uses only local sample collections for the dashboard widgets", () => {
    expect(adminStats.length).toBeGreaterThan(0);
    expect(appointmentData.length).toBeGreaterThan(0);
    expect(patientData.length).toBeGreaterThan(0);
    expect(activityData.length).toBeGreaterThan(0);
    expect(appointmentData.every((appointment) => appointment.id.startsWith("APT-"))).toBe(true);
    expect(patientData.every((patient) => patient.email.endsWith("@example.test"))).toBe(true);
  });
});
