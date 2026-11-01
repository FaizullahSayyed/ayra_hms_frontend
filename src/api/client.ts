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
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError("Unable to reach the hospital service. Please try again.", 0, "NETWORK_ERROR");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiRequestError("The hospital service returned an invalid response.", response.status, "INVALID_RESPONSE");
  }

  if (!response.ok) {
    const error = isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
    const message = typeof error?.message === "string"
      ? error.message
      : "The request could not be completed. Please try again.";
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

export function requestPatientLogin(): Promise<never> {
  return post("/auth/login", {}, () => {
    throw new ApiRequestError("Patient sign-in is not configured.", 501, "AUTH_NOT_CONFIGURED");
  });
}
