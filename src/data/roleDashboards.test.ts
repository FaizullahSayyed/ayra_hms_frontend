import { describe, expect, it } from "vitest";
import {
  getRoleDashboardInfo,
  roleDashboardInfo,
} from "./roleDashboards";
import { getRoleDashboardPath, roleDashboardRoutes } from "../components/auth/RoleDashboardRoutes";

describe("role dashboard routing and presentation", () => {
  it("provides one dashboard route and a distinct presentation for every role", () => {
    const roles = [
      "patient",
      "biller",
      "receptionist",
      "nurse",
      "doctor",
      "admin",
    ] as const;

    expect(roleDashboardRoutes.map((route) => route.role)).toEqual(roles);
    expect(new Set(roleDashboardRoutes.map((route) => route.path)).size).toBe(roles.length);
    expect(roles.map(getRoleDashboardPath)).toEqual([
      "/patient/dashboard",
      "/biller/dashboard",
      "/receptionist/dashboard",
      "/nurse/dashboard",
      "/doctor/dashboard",
      "/admin/dashboard",
    ]);
    expect(Object.keys(roleDashboardInfo)).toEqual(roles);
  });

  it("shows role-specific workspace copy without claiming live records", () => {
    expect(getRoleDashboardInfo("admin").label).toBe("Administrator");
    expect(getRoleDashboardInfo("doctor").title).toBe("Clinical workspace");
    for (const dashboard of Object.values(roleDashboardInfo)) {
      expect(dashboard.sections).toHaveLength(3);
      expect(dashboard.previewDescription).toMatch(/workspace is ready/i);
    }
  });
});
