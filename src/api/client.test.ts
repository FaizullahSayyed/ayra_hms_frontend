import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError, submitAppointmentRequest, submitContactMessage } from "./client";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("hospital API client", () => {
  it("submits appointment requests to the configured backend", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api/");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { id: 12, status: "requested", message: "Request received; not confirmed." },
    }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitAppointmentRequest({
      name: "Aanya Patel",
      email: "aanya@example.test",
      phone: "919876543210",
      department: "Cardiology",
      doctor: "Dr. Ananya Mehta",
      date: "2099-01-02",
      time: "09:00 AM",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/appointment-requests",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.status).toBe("requested");
  });

  it("returns server validation errors to the caller", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: "VALIDATION_ERROR", message: "Enter a valid email address." },
    }), { status: 400 })));

    await expect(submitContactMessage({
      name: "Aanya Patel",
      email: "invalid",
      message: "A question",
    })).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Enter a valid email address.",
    } satisfies Partial<ApiRequestError>);
  });

  it("does not claim a success when the API base URL is missing", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");

    await expect(submitContactMessage({
      name: "Aanya Patel",
      email: "aanya@example.test",
      message: "A question",
    })).rejects.toMatchObject({ code: "API_NOT_CONFIGURED" });
  });
});
