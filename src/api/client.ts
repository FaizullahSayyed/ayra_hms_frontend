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

export interface SignOutConfirmation {
  message: string;
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

let csrfToken: string | null = null;
let csrfGeneration = 0;
let currentUserRequest: Promise<SignedInUser | null> | null = null;
let sessionApiBaseUrl: string | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRegistrationRole(value: unknown): value is RegistrationRole {
  return typeof value === "string" && registrationRoles.some((role) => role === value);
}

function getApiBaseUrls(): string[] {
  const configuredUrls = import.meta.env.VITE_API_BASE_URL
    ?.split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  const uniqueUrls = configuredUrls ? [...new Set(configuredUrls)] : [];
  if (uniqueUrls.length === 0) {
    throw new ApiRequestError(
      "The hospital API is not configured. Set one or more comma-separated URLs in VITE_API_BASE_URL.",
      0,
      "API_NOT_CONFIGURED",
    );
  }
  return sessionApiBaseUrl
    ? [sessionApiBaseUrl, ...uniqueUrls.filter((url) => url !== sessionApiBaseUrl)]
    : uniqueUrls;
}

async function post<T>(
  path: string,
  body: unknown,
  parse: (value: unknown) => T,
  options: {
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
    notFoundMessage?: string;
    sessionBound?: boolean;
    onSuccess?: (response: Response, baseUrl: string) => void;
  } = {},
): Promise<T> {
  const baseUrls = getApiBaseUrls();
  const requestUrls = options.sessionBound && sessionApiBaseUrl
    ? [sessionApiBaseUrl]
    : baseUrls;
  let response: Response | undefined;
  let responseBaseUrl: string | undefined;
  for (const baseUrl of requestUrls) {
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options.headers },
        body: JSON.stringify(body),
        ...(options.credentials ? { credentials: options.credentials } : {}),
      });
      responseBaseUrl = baseUrl;
      break;
    } catch {
      continue;
    }
  }
  if (!response || !responseBaseUrl) {
    throw new ApiRequestError("Unable to reach any configured hospital service. Please try again.", 0, "NETWORK_ERROR");
  }

  let payload: unknown;
  try {
    payload = response.status === 204 ? undefined : await response.json();
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

  const result = parse(payload);
  options.onSuccess?.(response, responseBaseUrl);
  return result;
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
  csrfGeneration += 1;
  csrfToken = null;
  sessionApiBaseUrl = null;
  return post(
    "/v1/auth/login",
    input,
    parseSignIn,
    {
      credentials: "include",
      notFoundMessage: "Sign-in is not configured on the hospital backend yet. Please try again after the login endpoint is deployed.",
      onSuccess: (response, baseUrl) => {
        const token = response.headers.get("X-CSRF-Token")?.trim();
        if (!token) {
          throw new ApiRequestError(
            "Sign-in succeeded, but the backend did not provide the required CSRF token. Please contact support before continuing.",
            response.status,
            "CSRF_TOKEN_MISSING",
          );
        }
        csrfToken = token;
        sessionApiBaseUrl = baseUrl;
      },
    },
  );
}

async function fetchCurrentUser(): Promise<SignedInUser | null> {
  const requestGeneration = csrfGeneration;
  let response: Response | undefined;
  let responseBaseUrl: string | undefined;
  for (const baseUrl of getApiBaseUrls()) {
    try {
      response = await fetch(`${baseUrl}/v1/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      responseBaseUrl = baseUrl;
      break;
    } catch {
      continue;
    }
  }
  if (!response || !responseBaseUrl) {
    throw new ApiRequestError("Unable to reach any configured hospital service. Please try again.", 0, "NETWORK_ERROR");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiRequestError("The hospital service returned an invalid response.", response.status, "INVALID_RESPONSE");
  }

  if (response.status === 401) {
    if (csrfGeneration === requestGeneration) {
      csrfToken = null;
      sessionApiBaseUrl = null;
    }
    return null;
  }

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.message === "string"
      ? payload.message
      : "Unable to verify your sign-in session.";
    throw new ApiRequestError(message, response.status, "SESSION_CHECK_FAILED");
  }

  const user = isRecord(payload) && isRecord(payload.user) ? payload.user : undefined;
  const token = response.headers.get("X-CSRF-Token")?.trim();
  if (
    !isRecord(payload)
    || payload.success !== true
    || !user
    || typeof user.name !== "string"
    || typeof user.email !== "string"
    || !isRegistrationRole(user.role)
    || !token
  ) {
    if (csrfGeneration === requestGeneration) csrfToken = null;
    throw new ApiRequestError(
      "The hospital service returned an invalid session response.",
      response.status,
      "INVALID_RESPONSE",
    );
  }

  if (csrfGeneration === requestGeneration) {
    csrfToken = token;
    sessionApiBaseUrl = responseBaseUrl;
  }
  return { name: user.name, email: user.email, role: user.role };
}

export function getCurrentUser(): Promise<SignedInUser | null> {
  if (!currentUserRequest) {
    currentUserRequest = fetchCurrentUser().finally(() => {
      currentUserRequest = null;
    });
  }
  return currentUserRequest;
}

function parseSignOut(value: unknown): SignOutConfirmation {
  if (value === undefined) return { message: "Signed out successfully." };
  if (!isRecord(value) || value.success !== true || (value.message !== undefined && typeof value.message !== "string")) {
    throw new ApiRequestError("The sign-out service returned an unexpected response.", 0, "INVALID_RESPONSE");
  }
  return { message: typeof value.message === "string" ? value.message : "Signed out successfully." };
}

export async function signOut(): Promise<SignOutConfirmation> {
  if (!csrfToken) {
    throw new ApiRequestError("Your sign-in session is no longer available in this page. Please sign in again.", 0, "CSRF_TOKEN_UNAVAILABLE");
  }
  try {
    const result = await post(
      "/v1/auth/logout",
      {},
      parseSignOut,
      {
        credentials: "include",
        headers: { "X-CSRF-Token": csrfToken },
        sessionBound: true,
      },
    );
    csrfGeneration += 1;
    csrfToken = null;
    sessionApiBaseUrl = null;
    return result;
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
      csrfGeneration += 1;
      csrfToken = null;
      sessionApiBaseUrl = null;
    }
    throw error;
  }
}
