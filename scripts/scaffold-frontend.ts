#!/usr/bin/env bash
set -euo pipefail

# === Adjust this if needed ===
BASE="/home/deb/projects/msmebazaar-bg/msmebazaar-bg"

echo "Scaffolding missing files under ${BASE} ..."

mkdir -p "${BASE}/components/ui"
mkdir -p "${BASE}/components/layouts"
mkdir -p "${BASE}/components/navbar"
mkdir -p "${BASE}/hooks"
mkdir -p "${BASE}/lib"
mkdir -p "${BASE}/utils"

# ----------------------------
# components/ui/input.tsx
# ----------------------------
cat > "${BASE}/components/ui/input.tsx" <<'TSX'
/**
 * components/ui/input.tsx
 * Reusable Input component with label, error, and variants
 */
import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

export type InputVariant = "default" | "ghost" | "outline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  variant?: InputVariant;
  wrapperClassName?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default: "border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
  ghost: "bg-transparent border-0 focus:ring-0",
  outline: "border border-gray-200 focus:border-indigo-500 rounded-lg",
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, variant = "default", wrapperClassName, className, ...rest } = props;

  return (
    <div className={clsx("w-full", wrapperClassName)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400",
          variantClasses[variant],
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
TSX

# ----------------------------
# components/ui/spinner.tsx
# ----------------------------
cat > "${BASE}/components/ui/spinner.tsx" <<'TSX'
/**
 * components/ui/spinner.tsx
 * Lightweight accessible spinner component
 */
import React from "react";

export interface SpinnerProps {
  size?: number; // px
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, label = "Loading...", className }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div role="status" aria-live="polite" className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          fill="none"
          className="text-gray-300"
        />
        <path
          d={`M ${size / 2} ${strokeWidth} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          className="text-indigo-600"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
TSX

# ----------------------------
# components/layouts/main-layout.tsx
# ----------------------------
cat > "${BASE}/components/layouts/main-layout.tsx" <<'TSX'
/**
 * components/layouts/main-layout.tsx
 * Top-level layout wrapper used by pages/_app or App Router
 */
import React, { ReactNode } from "react";
import ThemeProvider from "../theme-provider";
import ErrorBoundary from "../common/ErrorBoundary";
import Loader from "../common/Loader";
import Navbar from "../navbar/navbar";

export interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={<Loader />}>
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
          <Navbar />
          {header}
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          {footer ?? (
            <footer className="border-t py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} MSMEBazaar
            </footer>
          )}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MainLayout;
TSX

# ----------------------------
# components/navbar/navbar-links.tsx
# ----------------------------
cat > "${BASE}/components/navbar/navbar-links.tsx" <<'TSX'
/**
 * components/navbar/navbar-links.tsx
 * Centralized navbar links and roles-aware link builder
 */
import { FeatureKey } from "../../types/feature";

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  featureKey?: FeatureKey; // optional gating key
  proOnly?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Business Loans", href: "/business-loans", featureKey: FeatureKey.BUSINESS_LOANS },
  { label: "Valuation", href: "/valuation", featureKey: FeatureKey.BUSINESS_VALUATION },
  { label: "Market Linkage", href: "/market-linkage", featureKey: FeatureKey.MARKET_LINKAGE },
  { label: "Networking", href: "/networking", href: "/msme-networking" },
];
export default NAV_LINKS;
TSX

# ----------------------------
# components/navbar/navbar.tsx
# ----------------------------
cat > "${BASE}/components/navbar/navbar.tsx" <<'TSX'
/**
 * components/navbar/navbar.tsx
 * Simple responsive navbar with role selector and upgrade CTA
 */
import React from "react";
import Link from "next/link";
import NAV_LINKS from "./navbar-links";
import { useAuth } from "../../hooks/use-auth";

const Navbar: React.FC = () => {
  const { user, isPro } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" legacyBehavior><a className="text-lg font-bold">MSMEBazaar</a></Link>
          <nav className="hidden md:flex space-x-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} legacyBehavior>
                <a className="text-sm text-gray-600 hover:text-indigo-600">{l.label}</a>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">Hi, {user.name}</span>
              {!isPro && (
                <Link href="/onboarding" legacyBehavior>
                  <a className="inline-flex items-center px-3 py-1 border rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700">
                    Upgrade ₹99
                  </a>
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" legacyBehavior><a className="px-3 py-1 text-sm">Login</a></Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
TSX

# ----------------------------
# hooks/use-query-params.ts
# ----------------------------
cat > "${BASE}/hooks/use-query-params.ts" <<'TS'
/**
 * hooks/use-query-params.ts
 * Hook to read and write URL query params (pages router)
 */
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export type QueryParams = Record<string, string | string[] | undefined>;

export function useQueryParams() {
  const router = useRouter();

  const params = useMemo<QueryParams>(() => {
    return router.query ?? {};
  }, [router.query]);

  const setParams = useCallback(
    (newParams: QueryParams, options?: { replace?: boolean }) => {
      const merged = { ...router.query, ...newParams };
      const clean: Record<string, any> = {};
      Object.keys(merged).forEach((k) => {
        const v = merged[k];
        if (v !== undefined && v !== null && v !== "") clean[k] = v;
      });
      if (options?.replace) {
        router.replace({ pathname: router.pathname, query: clean }, undefined, { shallow: true });
      } else {
        router.push({ pathname: router.pathname, query: clean }, undefined, { shallow: true });
      }
    },
    [router]
  );

  const removeParam = useCallback(
    (key: string) => {
      const copy = { ...router.query };
      delete copy[key];
      router.replace({ pathname: router.pathname, query: copy }, undefined, { shallow: true });
    },
    [router]
  );

  return { params, setParams, removeParam };
}
TS

# ----------------------------
# lib/api-client.ts
# ----------------------------
cat > "${BASE}/lib/api-client.ts" <<'TS'
/**
 * lib/api-client.ts
 * Lightweight wrapper around fetch that injects auth token and handles JSON
 */
import { getToken } from "../frontend/src/utils/storage";
import { APIError } from "../frontend/src/utils/error-handler";

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
TS

# ----------------------------
# lib/query-client.ts
# ----------------------------
cat > "${BASE}/lib/query-client.ts" <<'TS'
/**
 * lib/query-client.ts
 * react-query client instance used across the app
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
TS

# ----------------------------
# utils/storage.ts
# ----------------------------
cat > "${BASE}/utils/storage.ts" <<'TS'
/**
 * utils/storage.ts
 * Simple localStorage/sessionStorage helpers for tokens and simple persistence
 */
const TOKEN_KEY = "msmebazaar:token";
const USER_KEY = "msmebazaar:user";

export function setToken(token: string | null) {
  try {
    if (token === null) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    // silence for SSR or private mode
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setUser(user: any | null) {
  try {
    if (user === null) localStorage.removeItem(USER_KEY);
    else localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function getUser<T = any>(): T | null {
  try {
    const v = localStorage.getItem(USER_KEY);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}
TS

# ----------------------------
# utils/error-handler.ts
# ----------------------------
cat > "${BASE}/utils/error-handler.ts" <<'TS'
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
TS

echo "All files created."
