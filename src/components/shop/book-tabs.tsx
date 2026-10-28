"use client";

import { useState } from "react";
import { StarIcon } from "@/components/icons";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { BookDetail, Review } from "@/lib/types";

const TABS = [
  { id: "desc", label: "Тайлбар" },
  { id: "info", label: "Дэлгэрэнгүй мэдээлэл" },
  { id: "reviews", label: "Сэтгэгдэл" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function BookTabs({ book, reviews }: { book: BookDetail; reviews: Review[] }) {
  const [tab, setTab] = useState<TabId>("desc");

  const info: [string, string | null][] = [
    ["Зохиолч", book.authorName],
    ["Ангилал", book.categoryName],
    ["Орчуулагч", book.translator],
    ["Хуудасны тоо", book.pages ? String(book.pages) : null],
    ["Хавтас", book.binding === "hard" ? "Хатуу" : book.binding === "soft" ? "Зөөлөн" : null],
    ["ISBN", book.isbn],
  ];

  return (
    <section className="mt-12 md:mt-[72px]">
      <div role="tablist" aria-label="Номын мэдээлэл" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`btab-${t.id}`}
              aria-selected={on}
              aria-controls={`bpanel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`-mb-px min-h-12 shrink-0 cursor-pointer border-b-2 px-[18px] text-[15px] font-semibold md:text-base ${
                on ? "border-brand text-ink" : "border-transparent text-muted"
              }`}
            >
              {t.label}
              {t.id === "reviews" && reviews.length > 0 && ` (${reviews.length})`}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`bpanel-${tab}`} aria-labelledby={`btab-${tab}`} className="max-w-[820px] pt-7">
        {tab === "desc" && (
          <p className="whitespace-pre-line text-base leading-[1.75] text-body md:text-[17px]">
            {book.description || book.summary || "Тайлбар удахгүй нэмэгдэнэ."}
          </p>
        )}
        {tab === "info" && (
          <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line text-[15px]">
            {info.map(([label, value], i) => (
              <div key={label} className={`contents ${i < info.length - 1 ? "[&>*]:border-b [&>*]:border-line" : ""}`}>
                <dt className="px-[18px] py-3.5 text-muted">{label}</dt>
                <dd className="px-[18px] py-3.5">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        )}
        {tab === "reviews" && <Reviews slug={book.slug} reviews={reviews} />}
      </div>
    </section>
  );
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex text-gold" aria-label={`${value}/5 од`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} filled={n <= value} />
      ))}
    </span>
  );
}

function Reviews({ slug, reviews }: { slug: string; reviews: Review[] }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await apiFetch(`/books/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        body: JSON.stringify({ name, body, rating }),
      });
      setState("done");
      setName("");
      setBody("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.length === 0 ? (
        <p className="text-muted">Одоогоор сэтгэгдэл алга. Анхны сэтгэгдлийг та үлдээгээрэй.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{r.name}</span>
                <Stars value={r.rating} />
              </div>
              <p className="whitespace-pre-line leading-relaxed text-body">{r.body}</p>
              <span className="mt-2 block text-xs text-muted">{formatDate(r.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <h3 className="text-[15px] font-semibold">Таны сэтгэгдэл</h3>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Үнэлгээ</legend>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} од`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              className="cursor-pointer p-1 text-gold"
            >
              <StarIcon size={26} filled={n <= rating} />
            </button>
          ))}
        </fieldset>
        <label htmlFor="review-name" className="sr-only">
          Нэр
        </label>
        <input
          id="review-name"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Таны нэр"
          className="min-h-12 rounded-2xl border border-line-strong px-4 text-[15px]"
        />
        <label htmlFor="review" className="sr-only">
          Сэтгэгдэл
        </label>
        <textarea
          id="review"
          required
          minLength={3}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Энэ номын талаар бичнэ үү"
          className="resize-y rounded-2xl border border-line-strong px-4 py-3.5 text-[15px]"
        />
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state === "sending"}
            className="min-h-12 cursor-pointer rounded-full bg-brand px-6 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {state === "sending" ? "Илгээж байна…" : "Илгээх"}
          </button>
          <p aria-live="polite" className={`text-sm ${state === "error" ? "text-sale" : "text-brand"}`}>
            {state === "done" && "Баярлалаа! Таны сэтгэгдэл хянагдсаны дараа нийтлэгдэнэ."}
            {state === "error" && error}
          </p>
        </div>
      </form>
    </div>
  );
}
