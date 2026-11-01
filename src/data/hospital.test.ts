import { describe, expect, it } from "vitest";
import { doctors, reasons, services, statistics, testimonials } from "./hospital";

describe("homepage sample content", () => {
  it("includes the requested core medical departments", () => {
    expect(services.map((service) => service.name)).toEqual([
      "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
      "Dental Care", "Dermatology", "Emergency Care", "General Medicine",
    ]);
  });

  it("keeps all homepage content collections usable", () => {
    expect(statistics).toHaveLength(4);
    expect(doctors.length).toBeGreaterThanOrEqual(3);
    expect(reasons).toHaveLength(6);
    expect(testimonials.length).toBeGreaterThanOrEqual(2);
    expect(services.every((service) => service.description.length > 10)).toBe(true);
  });
});
