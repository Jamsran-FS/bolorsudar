"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const btn = {
  primary:
    "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-4 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-60",
  danger:
    "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-sale hover:bg-[#F6E6E3] disabled:opacity-60",
};

export const inputCls =
  "min-h-10 w-full rounded-xl border border-line-strong bg-white px-3 text-sm text-ink placeholder:text-muted disabled:bg-surface";

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-white ${className}`}>{children}</div>;
}

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium text-ink ${className}`}>
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand" />
      {label}
    </label>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-[#F6E6E3] px-4 py-3 text-sm text-sale">
      {message}
    </p>
  );
}

export function Loading() {
  return <div className="h-40 animate-pulse rounded-2xl bg-surface" aria-label="Ачаалж байна" />;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-12 text-center text-sm text-muted">{children}</p>;
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_STYLE[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
      <span>
        Нийт {total} · {page}/{pages} хуудас
      </span>
      <div className="flex gap-2">
        <button type="button" className={btn.ghost} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ← Өмнөх
        </button>
        <button type="button" className={btn.ghost} disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Дараах →
        </button>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Хаах" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button type="button" aria-label="Хаах" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-surface">
            <CloseIcon size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ColorDot({ color }: { color: string }) {
  return <span className="inline-block h-4 w-4 flex-none rounded border border-black/10" style={{ background: color }} />;
}

export function TableLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-ink hover:text-brand">
      {children}
    </Link>
  );
}

export const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted";
export const td = "px-4 py-3 align-middle";
