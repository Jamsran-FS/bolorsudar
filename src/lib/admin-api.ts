"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch, ApiError } from "./api";

const TOKEN_KEY = "huudas.admin.token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/** Fetch an admin endpoint; a 401 drops the session and sends the user to the login screen. */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  try {
    return await apiFetch<T>(path, { ...init, headers });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      setToken(null);
      if (!location.pathname.startsWith("/admin/login")) location.href = "/admin/login";
    }
    throw err;
  }
}

export const adminSend = <T>(method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown) =>
  adminFetch<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });

export function useAdminQuery<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  // Loading is derived: the request for the current key hasn't settled yet
  const key = `${path}#${tick}`;
  const [settled, setSettled] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    adminFetch<T>(path)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError(null);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Алдаа гарлаа"))
      .finally(() => !cancelled && setSettled(`${path}#${tick}`));
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading: path != null && settled !== key, reload, setData };
}
