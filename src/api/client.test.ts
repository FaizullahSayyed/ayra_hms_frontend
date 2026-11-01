import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiRequestError,
  registrationRoles,
  registerPatient,
  signIn,
  submitAppointmentRequest,
  submitContactMessage,
} from "./client";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("hospital API client", () => {
  it("registers a selected role at the v1 auth endpoint", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "Registration submitted successfully",
      user: { id: 8, name: "Aanya Patel", email: "aanya@example.test", role: "doctor" },
    }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(registerPatient({
      name: "Aanya Patel",
      email: "aanya@example.test",
      password: "A-secure-password",
      role: "doctor",
    })).resolves.toEqual({ message: "Registration submitted successfully", role: "doctor" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Aanya Patel",
          email: "aanya@example.test",
          password: "A-secure-password",
          role: "doctor",
        }),
      }),
    );
  });

  it("supports only the listed registration roles", () => {
    expect(registrationRoles).toEqual([
      "patient",
      "biller",
      "receptionist",
      "nurse",
      "doctor",
      "admin",
    ]);
  });

  it("sends sign-in credentials to the login endpoint and includes the session cookie", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "Signed in successfully.",
      user: { name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(signIn({
      email: "aanya@example.test",
      password: "A-secure-password",
    })).resolves.toEqual({
      message: "Signed in successfully.",
      user: { name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email: "aanya@example.test", password: "A-secure-password" }),
      }),
    );
  });

  it("reports clearly when the login endpoint has not been deployed", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Not Found", { status: 404 })));

    await expect(signIn({
      email: "aanya@example.test",
      password: "A-secure-password",
    })).rejects.toMatchObject({
      status: 404,
      code: "ENDPOINT_NOT_CONFIGURED",
      message: expect.stringContaining("not configured"),
    });
  });

  it("surfaces authentication failures without accepting an invalid login response", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Invalid email or password.",
    }), { status: 401 })));

    await expect(signIn({
      email: "aanya@example.test",
      password: "wrong-password",
    })).rejects.toMatchObject({
      status: 401,
      message: "Invalid email or password.",
    });
  });

  it("does not claim registration when the server assigns a different role", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "Patient registered successfully",
      user: { id: 8, name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
    }), { status: 201 })));

    await expect(registerPatient({
      name: "Aanya Patel",
      email: "aanya@example.test",
      password: "A-secure-password",
      role: "doctor",
    })).rejects.toMatchObject({
      code: "ROLE_NOT_CONFIRMED",
      status: 0,
    });
  });

  it("surfaces registration errors returned by the auth API", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Email is already registered",
    }), { status: 409 })));

    await expect(registerPatient({
      name: "Aanya Patel",
      email: "aanya@example.test",
      password: "A-secure-password",
      role: "patient",
    })).rejects.toMatchObject({
      status: 409,
      message: "Email is already registered",
    });
  });

  it("shows field validation details returned by the registration API", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Validation failed",
      errors: { password: ["Password must contain at least 8 characters"] },
    }), { status: 400 })));

    await expect(registerPatient({
      name: "Aanya Patel",
      email: "aanya@example.test",
      password: "short",
      role: "patient",
    })).rejects.toMatchObject({
      status: 400,
      message: "password: Password must contain at least 8 characters",
    });
  });

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
