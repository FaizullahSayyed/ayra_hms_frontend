import { describe, expect, it } from "vitest";
import {
  activityData,
  adminDashboardPreviewNotice,
  adminStats,
  appointmentData,
} from "./adminDashboard";

describe("admin dashboard preview boundary", () => {
  it("distinguishes live patient accounts from sample dashboard data", () => {
    expect(adminDashboardPreviewNotice).toMatch(/patient accounts are connected to the backend/i);
    expect(adminDashboardPreviewNotice).toMatch(/dashboard metrics, appointments, activity/i);
    expect(adminDashboardPreviewNotice).toMatch(/sample data or previews/i);
    expect(adminDashboardPreviewNotice).toMatch(/not clinical records or live hospital operations/i);
  });

  it("uses only local sample collections for the dashboard widgets", () => {
    expect(adminStats.length).toBeGreaterThan(0);
    expect(appointmentData.length).toBeGreaterThan(0);
    expect(activityData.length).toBeGreaterThan(0);
    expect(appointmentData.every((appointment) => appointment.id.startsWith("APT-"))).toBe(true);
  });
});
