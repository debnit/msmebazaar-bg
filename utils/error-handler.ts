/**
 * utils/error-handler.ts
 * Normalizes errors from fetch/fetch wrapper and API into a structured Error class
 */

export class APIError extends Error {
  public status: number;
  public payload: any;

  constructor(status: number, payload?: any) {
    super(typeof payload === "string" ? payload : payload?.message ?? "API Error");
    this.name = "APIError";
    this.status = status;
    this.payload = payload;
    Object.setPrototypeOf(this, APIError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      payload: this.payload,
    };
  }
}

/**
 * normalizeError
 * Accepts anything thrown and returns an object with consistent shape
 */
export function normalizeError(err: unknown) {
  if (err instanceof APIError) {
    return { status: err.status, message: err.message, payload: err.payload };
  }

  if (err instanceof Error) {
    return { status: 500, message: err.message };
  }

  return { status: 500, message: "Unknown error" };
}
