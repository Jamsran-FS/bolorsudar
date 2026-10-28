"use client";

import Link from "next/link";
import { useState } from "react";
import { btn, Card, Empty, ErrorNote, Loading, PageHeader, Pagination } from "@/components/admin/ui";
import { qs } from "@/lib/api";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { Paginated } from "@/lib/types";

interface AdminReview {
  id: number;
  name: string;
  rating: number;
  body: string;
  isApproved: boolean;
  createdAt: string;
  bookTitle: string;
  bookSlug: string;
}

const FILTERS = [
  { value: "pending", label: "Хүлээгдэж буй" },
  { value: "approved", label: "Нийтлэгдсэн" },
  { value: "", label: "Бүгд" },
] as const;

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<"" | "pending" | "approved">("pending");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paginated<AdminReview>>(`/admin/reviews${qs({ status, page, limit: 20 })}`);
  const [actionError, setActionError] = useState<string | null>(null);

  async function act(fn: () => Promise<unknown>) {
    setActionError(null);
    try {
      await fn();
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Алдаа гарлаа");
    }
  }

  return (
    <>
      <PageHeader title="Сэтгэгдэл" />
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold ${status === f.value ? "bg-ink text-white" : "border border-line bg-white text-body"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ErrorNote message={error || actionError} />
      {!data ? (
        loading && <Loading />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {data.items.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>
                    <strong>{r.name}</strong> · <span className="text-gold">{"★".repeat(r.rating)}</span>
                    <span className="text-line-strong">{"★".repeat(5 - r.rating)}</span> ·{" "}
                    <Link href={`/books/${r.bookSlug}`} target="_blank" className="text-brand">
                      {r.bookTitle}
                    </Link>
                  </span>
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </div>
                <p className="whitespace-pre-line text-sm text-body">{r.body}</p>
                <div className="flex flex-wrap gap-2">
                  {r.isApproved ? (
                    <button type="button" className={btn.ghost} onClick={() => act(() => adminSend("PATCH", `/admin/reviews/${r.id}`, { isApproved: false }))}>
                      Нуух
                    </button>
                  ) : (
                    <button type="button" className={btn.primary} onClick={() => act(() => adminSend("PATCH", `/admin/reviews/${r.id}`, { isApproved: true }))}>
                      Зөвшөөрөх
                    </button>
                  )}
                  <button
                    type="button"
                    className={btn.danger}
                    onClick={() => confirm("Сэтгэгдлийг устгах уу?") && act(() => adminSend("DELETE", `/admin/reviews/${r.id}`))}
                  >
                    Устгах
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {data.items.length === 0 && <Empty>Сэтгэгдэл алга.</Empty>}
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </Card>
      )}
    </>
  );
}
