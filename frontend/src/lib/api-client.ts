/**
 * lib/api-client.ts
 * Lightweight wrapper around fetch that injects auth token and handles JSON
 */
import { getToken } from "../utils/storage";
import { APIError } from "../utils/error-handler";

export interface ApiClientOptions {
  baseUrl?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiClient {
  private baseUrl: string;

  constructor(options?: ApiClientOptions) {
    this.baseUrl = options?.baseUrl ?? DEFAULT_BASE;
  }

  private buildUrl(path: string) {
    return path.startsWith("http") ? path : `${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  private async request<T = any>(input: string, init?: RequestInit): Promise<ApiResponse<T>> {
    const url = this.buildUrl(input);
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init && (init as any).headers),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new APIError(res.status, json ?? text ?? res.statusText);
      }
      return { data: json, status: res.status, headers: res.headers };
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new APIError(408, "Request timed out");
      }
      if (err instanceof APIError) throw err;
      throw new APIError(500, err?.message ?? "Network error");
    }
  }

  get<T = any>(path: string, init?: RequestInit) {
    return this.request<T>(path, { method: "GET", ...init });
  }

  post<T = any>(path: string, body?: any, init?: RequestInit) {
    return this.request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });
  }

  put<T = any>(path: string, body?: any, init?: RequestInit) {
    return this.request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });
  }

  delete<T = any>(path: string, init?: RequestInit) {
    return this.request<T>(path, { method: "DELETE", ...init });
  }
}

// default client
export const apiClient = new ApiClient();
export default apiClient;
