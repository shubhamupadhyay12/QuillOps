const TOKEN_KEY = "quillops_jwt";
const EMAIL_KEY = "quillops_user_email";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

interface ValidationError {
  loc?: Array<string | number>;
  msg?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export class ApiError extends Error {
  constructor(message: string, readonly status = 0, readonly code = "unknown") {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const metaUrl = document.querySelector<HTMLMetaElement>('meta[name="quillops-api-base"]')?.content.trim();

  // If in production mode:
  if (import.meta.env.PROD) {
    const targetUrl = envUrl || metaUrl;
    if (!targetUrl) {
      throw new Error("MISSING_PRODUCTION_API_CONFIG");
    }
    return targetUrl.replace(/\/$/, "");
  }

  // If in development mode:
  const localDev = () => {
    if (!/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return null;
    if (window.location.port === "8000") return window.location.origin;
    return `http://${window.location.hostname}:8000`;
  };

  const fallback = envUrl || metaUrl || localDev() || window.location.origin;
  return fallback.replace(/\/$/, "");
}

function readStoredValue(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

function clearStoredValue(key: string): void {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

function isExpired(token: string): boolean {
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export const auth = {
  getToken(): string | null {
    const token = readStoredValue(TOKEN_KEY);
    if (token && isExpired(token)) {
      this.clearSession();
      return null;
    }
    return token;
  },
  setSession(token: string, email: string, remember: boolean): void {
    this.clearSession();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(EMAIL_KEY, email);
  },
  setToken(token: string, remember = true): void {
    clearStoredValue(TOKEN_KEY);
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  },
  setUserEmail(email: string, remember = true): void {
    clearStoredValue(EMAIL_KEY);
    (remember ? localStorage : sessionStorage).setItem(EMAIL_KEY, email);
  },
  clearToken(): void {
    clearStoredValue(TOKEN_KEY);
  },
  clearSession(): void {
    clearStoredValue(TOKEN_KEY);
    clearStoredValue(EMAIL_KEY);
  },
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
  getUserEmail(): string {
    return readStoredValue(EMAIL_KEY) || "User";
  },
  logout(redirect = true): void {
    this.clearSession();
    if (redirect) window.location.hash = "#/login";
  },
};

function validationMessage(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item: ValidationError) => {
      const field = item.loc?.at(-1) ?? "field";
      return `${field}: ${item.msg || "Invalid value"}`;
    }).join(" · ");
  }
  return "The submitted information could not be validated.";
}

function htmlResponseMessage(url: string): string {
  const localHint = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
    ? " Start the QuillOps FastAPI server on port 8000 and try again."
    : " Please verify the configured API URL.";
  return `The API returned a webpage instead of JSON from ${url}.${localHint}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const token = auth.getToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(`Unable to reach the QuillOps API at ${getApiBaseUrl()}. Check that the backend is running and try again.`, 0, "network");
  }

  if (response.status === 204) return null as T;

  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("application/json")) {
    await response.text();
    throw new ApiError(htmlResponseMessage(url), response.status, "invalid-content-type");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("The API returned malformed JSON. Please try again shortly.", response.status, "invalid-json");
  }

  if (!response.ok) {
    const detail = typeof data === "object" && data !== null && "detail" in data
      ? (data as { detail: unknown }).detail
      : undefined;
    if (response.status === 401 && path !== "/auth/login") auth.logout();
    throw new ApiError(
      detail !== undefined ? validationMessage(detail) : response.status >= 500 ? "The server encountered an error. Please try again." : "The request could not be completed.",
      response.status,
      response.status === 401 ? "authentication" : "api",
    );
  }

  return data as T;
}

export function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    if (caught.code === "network") {
      return "Unable to reach the authentication server. Please try again shortly.";
    }
    if (caught.status === 401) {
      return "Incorrect email address or password.";
    }
    if (caught.status === 429) {
      return "Too many attempts. Please wait and try again.";
    }
    if (caught.status >= 500) {
      return "The server could not complete the request. Please try again.";
    }
    return caught.message || "The request could not be completed.";
  }
  if (caught instanceof Error) {
    if (caught.message === "MISSING_PRODUCTION_API_CONFIG") {
      return "The application server is not configured for this deployment.";
    }
    return caught.message;
  }
  return "Authentication failed. Please try again.";
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path, { method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T = unknown>(path: string) => request<T>(path, { method: "DELETE" }),
  getErrorMessage,
};
