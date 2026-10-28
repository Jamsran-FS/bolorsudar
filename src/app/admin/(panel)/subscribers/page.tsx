"use client";

import { useState } from "react";
import { btn, Card, Empty, ErrorNote, inputCls, Loading, PageHeader, Pagination, td, th } from "@/components/admin/ui";
import { qs } from "@/lib/api";
import { adminFetch, adminSend, useAdminQuery } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { Paginated } from "@/lib/types";

type Subscriber = { id: number; email: string; createdAt: string };

export default function AdminSubscribersPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paginated<Subscriber>>(`/admin/subscribers${qs({ q: search, page, limit: 50 })}`);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function remove(s: Subscriber) {
    if (!confirm(`${s.email} хаягийг жагсаалтаас хасах уу?`)) return;
    try {
      await adminSend("DELETE", `/admin/subscribers/${s.id}`);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  async function exportCsv() {
    setExporting(true);
    try {
      const all: Subscriber[] = [];
      for (let p = 1; ; p++) {
        const chunk = await adminFetch<Paginated<Subscriber>>(`/admin/subscribers?page=${p}&limit=100`);
        all.push(...chunk.items);
        if (all.length >= chunk.total || chunk.items.length === 0) break;
      }
      const csv = "email,created_at\n" + all.map((s) => `${s.email},${s.createdAt}`).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "subscribers.csv" });
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Экспорт хийж чадсангүй");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader title="Мэдээ захиалагчид">
        <button type="button" className={btn.ghost} onClick={exportCsv} disabled={exporting}>
          {exporting ? "Бэлдэж байна…" : "CSV татах"}
        </button>
      </PageHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
        className="mb-4 flex gap-2"
      >
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Имэйл хайх…" className={`${inputCls} max-w-xs`} />
        <button type="submit" className={btn.ghost}>
          Хайх
        </button>
      </form>
      <ErrorNote message={error || actionError} />
      {!data ? (
        loading && <Loading />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-surface/60">
              <tr>
                <th className={th}>Имэйл</th>
                <th className={th}>Бүртгүүлсэн</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.items.map((s) => (
                <tr key={s.id}>
                  <td className={td}>{s.email}</td>
                  <td className={`${td} text-muted`}>{formatDate(s.createdAt)}</td>
                  <td className={`${td} text-right`}>
                    <button type="button" className={btn.danger} onClick={() => remove(s)}>
                      Хасах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.items.length === 0 && <Empty>Захиалагч алга.</Empty>}
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </Card>
      )}
    </>
  );
}
