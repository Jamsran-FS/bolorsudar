import type { Author, BookCard, BookDetail, Category, Paginated, Review } from "./types";

/** Server components talk to the API directly; the browser uses the public URL. */
export const API_URL =
  (typeof window === "undefined" ? process.env.API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(", ") : (body.message ?? message);
    } catch {}
    throw new ApiError(res.status, message);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  const s = search.toString();
  return s ? `?${s}` : "";
}

export type BookListParams = {
  list?: "new" | "best" | "soon" | "sale";
  category?: string;
  author?: string;
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const api = {
  books: (params: BookListParams = {}) => apiFetch<Paginated<BookCard>>(`/books${qs(params)}`),
  featured: () => apiFetch<BookDetail | null>("/books/featured"),
  book: (slug: string) =>
    apiFetch<BookDetail & { related: BookCard[] }>(`/books/${encodeURIComponent(slug)}`),
  reviews: (slug: string) => apiFetch<Review[]>(`/books/${encodeURIComponent(slug)}/reviews`),
  categories: () => apiFetch<Category[]>("/categories"),
  authors: (featured = false) => apiFetch<Author[]>(`/authors${featured ? "?featured=true" : ""}`),
};

export { qs };
