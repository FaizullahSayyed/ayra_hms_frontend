export interface AppointmentRequestInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  doctor: string | null;
  date: string;
  time: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export interface PatientRegistrationInput {
  name: string;
  email: string;
  password: string;
  role: RegistrationRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignedInUser {
  name: string;
  email: string;
  role: RegistrationRole;
}

export interface SignInConfirmation {
  message: string;
  user: SignedInUser;
}

export const registrationRoles = [
  "patient",
  "biller",
  "receptionist",
  "nurse",
  "doctor",
  "admin",
] as const;

export type RegistrationRole = (typeof registrationRoles)[number];

export interface RegistrationConfirmation {
  message: string;
  role: RegistrationRole;
}

export interface SubmissionConfirmation {
  id: number | string;
  message: string;
  status?: "requested";
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRegistrationRole(value: unknown): value is RegistrationRole {
  return typeof value === "string" && registrationRoles.some((role) => role === value);
}

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new ApiRequestError(
      "The hospital API is not configured. Set VITE_API_BASE_URL in the frontend environment.",
      0,
      "API_NOT_CONFIGURED",
    );
  }
  return baseUrl;
}

async function post<T>(
  path: string,
  body: unknown,
  parse: (value: unknown) => T,
  options: { credentials?: RequestCredentials; notFoundMessage?: string } = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...(options.credentials ? { credentials: options.credentials } : {}),
    });
  } catch {
    throw new ApiRequestError("Unable to reach the hospital service. Please try again.", 0, "NETWORK_ERROR");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (!response.ok && response.status === 404 && options.notFoundMessage) {
      throw new ApiRequestError(options.notFoundMessage, response.status, "ENDPOINT_NOT_CONFIGURED");
    }
    throw new ApiRequestError("The hospital service returned an invalid response.", response.status, "INVALID_RESPONSE");
  }

  if (!response.ok && response.status === 404 && options.notFoundMessage) {
    throw new ApiRequestError(options.notFoundMessage, response.status, "ENDPOINT_NOT_CONFIGURED");
  }

  if (!response.ok) {
    const error = isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
    let responseMessage = isRecord(payload) && typeof payload.message === "string"
      ? payload.message
      : undefined;
    if (responseMessage === "Validation failed" && isRecord(payload) && isRecord(payload.errors)) {
      const fieldErrors = Object.entries(payload.errors)
        .flatMap(([field, messages]) => Array.isArray(messages)
          ? messages.filter((message): message is string => typeof message === "string").map((message) => `${field}: ${message}`)
          : []);
      if (fieldErrors.length > 0) responseMessage = fieldErrors.join(" ");
    }
    const message = typeof error?.message === "string"
      ? error.message
      : responseMessage ?? "The request could not be completed. Please try again.";
    const code = typeof error?.code === "string" ? error.code : "REQUEST_FAILED";
    throw new ApiRequestError(message, response.status, code);
  }

  return parse(payload);
}

function parseSubmission(value: unknown, expectedStatus?: "requested"): SubmissionConfirmation {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new ApiRequestError("The hospital service returned an invalid response.", 0, "INVALID_RESPONSE");
  }

  const { id, message, status } = value.data;
  if (
    (typeof id !== "number" && typeof id !== "string")
    || typeof message !== "string"
    || (expectedStatus && status !== expectedStatus)
  ) {
    throw new ApiRequestError("The hospital service returned an invalid response.", 0, "INVALID_RESPONSE");
  }

  return {
    id,
    message,
    ...(expectedStatus ? { status: expectedStatus } : {}),
  };
}

export function submitAppointmentRequest(
  input: AppointmentRequestInput,
): Promise<SubmissionConfirmation> {
  return post("/appointment-requests", input, (value) => parseSubmission(value, "requested"));
}

export function submitContactMessage(input: ContactMessageInput): Promise<SubmissionConfirmation> {
  return post("/contact-messages", input, (value) => parseSubmission(value));
}

function parseRegistration(value: unknown, requestedRole: RegistrationRole): RegistrationConfirmation {
  const user = isRecord(value) && isRecord(value.user) ? value.user : undefined;
  if (
    !isRecord(value)
    || value.success !== true
    || typeof value.message !== "string"
    || !user
    || !isRegistrationRole(user.role)
  ) {
    throw new ApiRequestError(
      "The registration service returned an unexpected response.",
      0,
      "INVALID_RESPONSE",
    );
  }
  if (user.role !== requestedRole) {
    throw new ApiRequestError(
      "The registration service did not confirm the requested role. Please contact an administrator.",
      0,
      "ROLE_NOT_CONFIRMED",
    );
  }
  return { message: value.message, role: user.role };
}

export function registerPatient(input: PatientRegistrationInput): Promise<RegistrationConfirmation> {
  return post("/v1/auth/register", input, (value) => parseRegistration(value, input.role));
}

function parseSignIn(value: unknown): SignInConfirmation {
  const user = isRecord(value) && isRecord(value.user) ? value.user : undefined;
  if (
    !isRecord(value)
    || value.success !== true
    || typeof value.message !== "string"
    || !user
    || typeof user.name !== "string"
    || typeof user.email !== "string"
    || !isRegistrationRole(user.role)
  ) {
    throw new ApiRequestError("The sign-in service returned an unexpected response.", 0, "INVALID_RESPONSE");
  }
  return {
    message: value.message,
    user: { name: user.name, email: user.email, role: user.role },
  };
}

export function signIn(input: SignInInput): Promise<SignInConfirmation> {
  return post(
    "/v1/auth/login",
    input,
    parseSignIn,
    {
      credentials: "include",
      notFoundMessage: "Sign-in is not configured on the hospital backend yet. Please try again after the login endpoint is deployed.",
    },
  );
}
