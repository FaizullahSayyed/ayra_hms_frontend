import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiRequestError,
  createUser,
  getAdminStaff,
  getAdminPatients,
  getCurrentUser,
  registrationRoles,
  registerPatient,
  signOut,
  signIn,
  submitAppointmentRequest,
  submitContactMessage,
  updateAdminStaffUser,
} from "./client";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("hospital API client", () => {
  it("restores the authenticated user and refreshes the CSRF token from the backend", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Aanya Patel", email: "aanya@example.test", role: "doctor" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "restored-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Signed out successfully.",
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentUser()).resolves.toEqual({
      name: "Aanya Patel",
      email: "aanya@example.test",
      role: "doctor",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/auth/me",
      expect.objectContaining({ method: "GET", credentials: "include" }),
    );
    await expect(signOut()).resolves.toEqual({ message: "Signed out successfully." });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/auth/logout",
      expect.objectContaining({
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "restored-session-csrf",
        },
      }),
    );
  });

  it("creates a staff user with the session cookie and CSRF token", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Aanya Patel", email: "aanya@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "User created.",
        user: { id: "usr_123", name: "Mira Shah", email: "mira@example.test", role: "doctor" },
      }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(createUser({
      username: "mira.shah",
      email: "mira@example.test",
      firstName: "Mira",
      lastName: "Shah",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      phone: "555-0100",
      gender: "female",
      role: "doctor",
    })).resolves.toEqual({
      id: "usr_123",
      name: "Mira Shah",
      email: "mira@example.test",
      role: "doctor",
      message: "User created.",
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/admin/users",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "admin-session-csrf",
        },
        body: JSON.stringify({
          username: "mira.shah",
          email: "mira@example.test",
          firstName: "Mira",
          lastName: "Shah",
          password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
          phone: "555-0100",
          gender: "female",
          role: "doctor",
        }),
      }),
    );
  });

  it("does not report user creation unless the backend confirms the requested role", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Hospital Admin", email: "admin@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "User created.",
        user: { id: "usr_123", name: "Mira Shah", email: "mira@example.test", role: "nurse" },
      }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(createUser({
      username: "mira.shah",
      email: "mira@example.test",
      firstName: "Mira",
      lastName: "Shah",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      gender: "female",
      role: "doctor",
    })).rejects.toMatchObject({ code: "ROLE_NOT_CONFIRMED" });
  });

  it("does not send patients through the staff-user endpoint", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(() => createUser({
      username: "mira.shah",
      email: "mira@example.test",
      firstName: "Mira",
      lastName: "Shah",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      gender: "female",
      role: "patient",
    })).toThrow("Patient registration will be available through a separate feature.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads the live patient account directory using the authenticated session", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Hospital Admin", email: "admin@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        patients: [{
          id: "patient-123",
          name: "Mira Shah",
          email: "mira@example.test",
          createdAt: "2026-11-08T08:30:00.000Z",
        }],
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(getAdminPatients()).resolves.toEqual([{
      id: "patient-123",
      name: "Mira Shah",
      email: "mira@example.test",
      createdAt: "2026-11-08T08:30:00.000Z",
    }]);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/admin/patients",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("loads staff with their signed-in status using the authenticated session", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Hospital Admin", email: "admin@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        users: [{
          id: "staff-123",
          username: "aanya.patel",
          firstName: "Aanya",
          lastName: "Patel",
          email: "aanya@example.test",
          role: "doctor",
          phone: "555-0100",
          gender: "female",
          createdAt: "2026-11-08T08:30:00.000Z",
          isSignedIn: true,
        }],
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(getAdminStaff()).resolves.toEqual([{
      id: "staff-123",
      username: "aanya.patel",
      firstName: "Aanya",
      lastName: "Patel",
      email: "aanya@example.test",
      role: "doctor",
      phone: "555-0100",
      gender: "female",
      createdAt: "2026-11-08T08:30:00.000Z",
      isSignedIn: true,
    }]);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/admin/users",
      expect.objectContaining({ method: "GET", credentials: "include" }),
    );
  });

  it("rejects patient records in the staff directory response", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Hospital Admin", email: "admin@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        users: [{
          id: "patient-123",
          username: "patient",
          firstName: "Mira",
          lastName: "Shah",
          email: "mira@example.test",
          role: "patient",
          createdAt: "2026-11-08T08:30:00.000Z",
          isSignedIn: false,
        }],
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(getAdminStaff()).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });

  it("updates staff details and sends a new password only when supplied", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        user: { name: "Hospital Admin", email: "admin@example.test", role: "admin" },
      }), {
        status: 200,
        headers: { "X-CSRF-Token": "admin-session-csrf" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Staff account updated.",
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCurrentUser();
    await expect(updateAdminStaffUser("staff-123", {
      username: "aanya.patel",
      firstName: "Aanya",
      lastName: "Patel",
      email: "aanya@example.test",
      role: "doctor",
      phone: "555-0100",
      gender: "female",
      password: "A-new-secure-password",
    })).resolves.toEqual({ message: "Staff account updated." });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/admin/users/staff-123",
      expect.objectContaining({
        method: "PATCH",
        credentials: "include",
        headers: expect.objectContaining({
          "X-CSRF-Token": "admin-session-csrf",
        }),
        body: JSON.stringify({
          username: "aanya.patel",
          firstName: "Aanya",
          lastName: "Patel",
          email: "aanya@example.test",
          role: "doctor",
          phone: "555-0100",
          gender: "female",
          password: "A-new-secure-password",
        }),
      }),
    );
  });

  it("treats an expired session as unauthenticated", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Authentication required.",
    }), { status: 401 })));

    await expect(getCurrentUser()).resolves.toBeNull();
    await expect(signOut()).rejects.toMatchObject({ code: "CSRF_TOKEN_UNAVAILABLE" });
  });

  it("registers a selected role at the v1 auth endpoint", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "Registration submitted successfully",
      user: { id: 8, name: "Aanya Patel", email: "aanya@example.test", role: "doctor" },
    }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(registerPatient({
      username: "aanya.patel",
      email: "aanya@example.test",
      firstName: "Aanya",
      lastName: "Patel",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      gender: "female",
      role: "doctor",
    })).resolves.toEqual({ message: "Registration submitted successfully", role: "doctor" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "aanya.patel",
          email: "aanya@example.test",
          firstName: "Aanya",
          lastName: "Patel",
          password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
          gender: "female",
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
    }), { status: 200, headers: { "X-CSRF-Token": "csrf-session-token" } }));
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

  it("fails over in order on network errors and keeps logout pinned to the successful login backend", async () => {
    vi.stubEnv(
      "VITE_API_BASE_URL",
      "http://localhost:3001/api, https://ayra-hms-backend.vercel.app/",
    );
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Signed in successfully.",
        user: { name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
      }), { status: 200, headers: { "X-CSRF-Token": "fallback-session-csrf" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Signed out successfully.",
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await signIn({ email: "aanya@example.test", password: "A-secure-password" });
    await signOut();

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "http://localhost:3001/api/v1/auth/login",
      "https://ayra-hms-backend.vercel.app/v1/auth/login",
      "https://ayra-hms-backend.vercel.app/v1/auth/logout",
    ]);
    expect(fetchMock.mock.calls[2][1]).toEqual(expect.objectContaining({
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": "fallback-session-csrf",
      },
    }));
  });

  it("does not fail over on an HTTP authentication error", async () => {
    vi.stubEnv(
      "VITE_API_BASE_URL",
      "http://localhost:3001/api,https://ayra-hms-backend.vercel.app/api",
    );
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: "Invalid email or password.",
    }), { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(signIn({
      email: "aanya@example.test",
      password: "wrong-password",
    })).rejects.toMatchObject({ status: 401, message: "Invalid email or password." });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/v1/auth/login",
      expect.any(Object),
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

  it("sends logout with the session cookie and the CSRF token returned by login", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Signed in successfully.",
        user: { name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
      }), { status: 200, headers: { "X-CSRF-Token": "csrf-session-token" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        message: "Signed out successfully.",
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await signIn({ email: "aanya@example.test", password: "A-secure-password" });
    await expect(signOut()).resolves.toEqual({ message: "Signed out successfully." });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3001/api/v1/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "csrf-session-token",
        },
        body: "{}",
      }),
    );
    await expect(signOut()).rejects.toMatchObject({ code: "CSRF_TOKEN_UNAVAILABLE" });
  });

  it("does not allow login success without the CSRF response header needed for logout", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001/api");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      message: "Signed in successfully.",
      user: { name: "Aanya Patel", email: "aanya@example.test", role: "patient" },
    }), { status: 200 })));

    await expect(signIn({
      email: "aanya@example.test",
      password: "A-secure-password",
    })).rejects.toMatchObject({
      status: 200,
      code: "CSRF_TOKEN_MISSING",
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
      username: "aanya.patel",
      email: "aanya@example.test",
      firstName: "Aanya",
      lastName: "Patel",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      gender: "female",
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
      username: "aanya.patel",
      email: "aanya@example.test",
      firstName: "Aanya",
      lastName: "Patel",
      password: "e09a179c835a77e75458f63c84a8f3bb670ebf7c714783b1",
      gender: "female",
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
      username: "aanya.patel",
      email: "aanya@example.test",
      firstName: "Aanya",
      lastName: "Patel",
      password: "short",
      gender: "female",
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
