"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, ErrorNote, Loading, PageHeader, StatusBadge } from "@/components/admin/ui";
import { useAdminQuery } from "@/lib/admin-api";
import { formatPrice, ORDER_STATUS_LABEL } from "@/lib/format";
import type { OrderStatus, OrderSummary, Paginated } from "@/lib/types";

interface Stats {
  totals: { orders: number; revenue: number };
  last30Days: { orders: number; revenue: number };
  byStatus: { status: OrderStatus; count: number }[];
  daily: { day: string; revenue: number; orders: number }[];
  books: number;
  pendingReviews: number;
  subscribers: number;
  lowStock: { id: number; title: string; stock: number }[];
}

function Tile({ label, value, sub, href }: { label: string; value: string; sub?: string; href?: string }) {
  const body = (
    <Card className="flex h-full flex-col gap-1 p-5">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </Card>
  );
  return href ? (
    <Link href={href} className="block hover:[&>div]:border-line-strong">
      {body}
    </Link>
  ) : (
    body
  );
}

/** Last 30 calendar days, zero-filled, so gaps in sales show as gaps rather than collapsing. */
function useDays(daily: Stats["daily"] | undefined) {
  return useMemo(() => {
    const byDay = new Map((daily ?? []).map((d) => [d.day, d]));
    const out: { day: string; revenue: number; orders: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      out.push(byDay.get(key) ?? { day: key, revenue: 0, orders: 0 });
    }
    return out;
  }, [daily]);
}

function RevenueChart({ daily }: { daily: Stats["daily"] }) {
  const days = useDays(daily);
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.revenue));
  const H = 160;
  const active = hover != null ? days[hover] : null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Өдрийн борлуулалт · сүүлийн 30 хоног</h2>
        <span className="text-sm text-muted" aria-live="polite">
          {active ? (
            <>
              <strong className="text-ink">{formatPrice(active.revenue)}</strong> · {active.orders} захиалга · {active.day}
            </>
          ) : (
            `Дээд: ${formatPrice(max === 1 ? 0 : max)}`
          )}
        </span>
      </div>
      <div className="relative" style={{ height: H }} onPointerLeave={() => setHover(null)}>
        {/* recessive gridlines at 0 / 50% / 100% */}
        {[0, 0.5, 1].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-line" style={{ bottom: f * H }} />
        ))}
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {days.map((d, i) => (
            <button
              key={d.day}
              type="button"
              aria-label={`${d.day}: ${formatPrice(d.revenue)}, ${d.orders} захиалга`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="group flex h-full flex-1 cursor-default items-end"
            >
              <span
                className={`block w-full rounded-t-[4px] ${hover === i ? "bg-brand-dark" : "bg-brand"}`}
                style={{ height: d.revenue ? Math.max(2, (d.revenue / max) * H) : 0 }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{days[0].day}</span>
        <span>{days[days.length - 1].day}</span>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted">Хүснэгтээр харах</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-muted">
              <th className="py-1 font-medium">Өдөр</th>
              <th className="py-1 text-right font-medium">Захиалга</th>
              <th className="py-1 text-right font-medium">Орлого</th>
            </tr>
          </thead>
          <tbody>
            {days
              .filter((d) => d.orders > 0)
              .map((d) => (
                <tr key={d.day} className="border-t border-line">
                  <td className="py-1">{d.day}</td>
                  <td className="py-1 text-right">{d.orders}</td>
                  <td className="py-1 text-right">{formatPrice(d.revenue)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </Card>
  );
}

export default function DashboardPage() {
  const stats = useAdminQuery<Stats>("/admin/stats");
  const recent = useAdminQuery<Paginated<OrderSummary>>("/admin/orders?limit=6");
  const s = stats.data;

  return (
    <>
      <PageHeader title="Хянах самбар" />
      <ErrorNote message={stats.error} />
      {!s ? (
        stats.loading && <Loading />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label="Орлого (30 хоног)" value={formatPrice(s.last30Days.revenue)} sub={`Нийт ${formatPrice(s.totals.revenue)}`} />
            <Tile label="Захиалга (30 хоног)" value={String(s.last30Days.orders)} sub={`Нийт ${s.totals.orders}`} href="/admin/orders" />
            <Tile label="Хүлээгдэж буй сэтгэгдэл" value={String(s.pendingReviews)} href="/admin/reviews" />
            <Tile label="Мэдээ захиалагч" value={String(s.subscribers)} sub={`${s.books} ном каталогт`} href="/admin/subscribers" />
          </div>

          <RevenueChart daily={s.daily} />

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-semibold">Сүүлийн захиалгууд</h2>
                <Link href="/admin/orders" className="text-sm font-semibold text-brand">
                  Бүгд →
                </Link>
              </div>
              {recent.data?.items.length ? (
                <ul className="divide-y divide-line">
                  {recent.data.items.map((o) => (
                    <li key={o.id}>
                      <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-surface">
                        <span className="font-semibold text-ink">
                          #{o.id} · {o.customerName}
                        </span>
                        <span className="flex items-center gap-3">
                          <StatusBadge status={o.status} />
                          <span className="font-semibold text-ink">{formatPrice(o.total)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-muted">{recent.loading ? "Ачаалж байна…" : "Захиалга алга."}</p>
              )}
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="p-5">
                <h2 className="mb-3 font-semibold">Төлөв</h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((st) => (
                    <li key={st} className="flex items-center justify-between">
                      <StatusBadge status={st} />
                      <span className="font-semibold">{s.byStatus.find((b) => b.status === st)?.count ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-5">
                <h2 className="mb-3 font-semibold">Үлдэгдэл бага</h2>
                {s.lowStock.length === 0 ? (
                  <p className="text-sm text-muted">Бүх ном хангалттай.</p>
                ) : (
                  <ul className="flex flex-col gap-2 text-sm">
                    {s.lowStock.map((b) => (
                      <li key={b.id} className="flex items-center justify-between gap-3">
                        <Link href={`/admin/books/${b.id}`} className="truncate text-ink">
                          {b.title}
                        </Link>
                        <span className={`font-semibold ${b.stock === 0 ? "text-sale" : "text-[#8A5A0B]"}`}>
                          {b.stock === 0 ? "⚠ Дууссан" : `${b.stock} ш`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
