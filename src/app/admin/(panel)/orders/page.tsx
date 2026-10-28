"use client";

import Link from "next/link";
import { useState } from "react";
import { btn, Card, Empty, ErrorNote, inputCls, Loading, PageHeader, Pagination, StatusBadge, td, th } from "@/components/admin/ui";
import { qs } from "@/lib/api";
import { useAdminQuery } from "@/lib/admin-api";
import { formatDate, formatPrice, ORDER_STATUS_LABEL } from "@/lib/format";
import type { OrderStatus, OrderSummary, Paginated } from "@/lib/types";

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdminQuery<Paginated<OrderSummary>>(`/admin/orders${qs({ status, q: search, page, limit: 20 })}`);

  return (
    <>
      <PageHeader title="Захиалга" />
      <div className="mb-4 flex flex-wrap gap-2">
        {(["", ...Object.keys(ORDER_STATUS_LABEL)] as (OrderStatus | "")[]).map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold ${status === s ? "bg-ink text-white" : "bg-white text-body border border-line"}`}
          >
            {s ? ORDER_STATUS_LABEL[s] : "Бүгд"}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
        className="mb-4 flex gap-2"
      >
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, утас, имэйл…" className={`${inputCls} max-w-xs`} />
        <button type="submit" className={btn.ghost}>
          Хайх
        </button>
      </form>

      <ErrorNote message={error} />
      {!data ? (
        loading && <Loading />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-b border-line bg-surface/60">
                <tr>
                  <th className={th}>№</th>
                  <th className={th}>Огноо</th>
                  <th className={th}>Захиалагч</th>
                  <th className={`${th} text-right`}>Ном</th>
                  <th className={`${th} text-right`}>Дүн</th>
                  <th className={th}>Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/50">
                    <td className={td}>
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand">
                        #{o.id}
                      </Link>
                    </td>
                    <td className={`${td} whitespace-nowrap text-muted`}>{formatDate(o.createdAt)}</td>
                    <td className={td}>
                      <div className="font-semibold">{o.customerName}</div>
                      <div className="text-xs text-muted">{o.phone}</div>
                    </td>
                    <td className={`${td} text-right`}>{o.itemCount}</td>
                    <td className={`${td} text-right font-semibold`}>{formatPrice(o.total)}</td>
                    <td className={td}>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.items.length === 0 && <Empty>Захиалга олдсонгүй.</Empty>}
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </Card>
      )}
    </>
  );
}
