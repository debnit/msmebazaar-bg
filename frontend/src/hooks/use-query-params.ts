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
