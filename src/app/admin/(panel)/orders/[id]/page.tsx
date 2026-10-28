"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { btn, Card, ErrorNote, Loading, PageHeader, StatusBadge } from "@/components/admin/ui";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import { formatDate, formatPrice, ORDER_STATUS_LABEL } from "@/lib/format";
import type { OrderDetail, OrderStatus } from "@/lib/types";

const FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, error, loading, setData } = useAdminQuery<OrderDetail>(`/admin/orders/${id}`);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function setStatus(status: OrderStatus) {
    if (status === "cancelled" && !confirm("Захиалгыг цуцлах уу? Номын үлдэгдэл буцаж нэмэгдэнэ.")) return;
    setSaving(true);
    setActionError(null);
    try {
      const updated = await adminSend<OrderDetail>("PATCH", `/admin/orders/${id}/status`, { status });
      setData((o) => (o ? { ...o, status: updated.status, updatedAt: updated.updatedAt } : o));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Төлөв өөрчилж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link href="/admin/orders" className="mb-2 inline-block text-sm text-muted">
        ← Захиалга
      </Link>
      <PageHeader title={`Захиалга #${id}`}>{order && <StatusBadge status={order.status} />}</PageHeader>
      <ErrorNote message={error || actionError} />
      {!order ? (
        loading && <Loading />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface/60 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ном</th>
                  <th className="px-4 py-3 text-right font-semibold">Үнэ</th>
                  <th className="px-4 py-3 text-right font-semibold">Тоо</th>
                  <th className="px-4 py-3 text-right font-semibold">Дүн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-4 py-3">
                      {it.bookId ? (
                        <Link href={`/admin/books/${it.bookId}`} className="font-semibold text-ink">
                          {it.title}
                        </Link>
                      ) : (
                        <span className="font-semibold">{it.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">{formatPrice(it.price)}</td>
                    <td className="px-4 py-3 text-right">{it.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-line">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-muted">
                    Нийт
                  </td>
                  <td className="px-4 py-3 text-right font-display text-lg font-semibold">{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-2 p-5 text-sm">
              <h2 className="mb-1 font-semibold">Захиалагч</h2>
              <span className="font-semibold">{order.customerName}</span>
              <a href={`tel:${order.phone}`} className="text-brand">
                {order.phone}
              </a>
              {order.email && (
                <a href={`mailto:${order.email}`} className="text-brand">
                  {order.email}
                </a>
              )}
              <p className="whitespace-pre-line text-body">{order.address}</p>
              {order.note && <p className="rounded-xl bg-surface p-3 text-body">📝 {order.note}</p>}
              <span className="mt-2 text-xs text-muted">Үүссэн: {formatDate(order.createdAt)}</span>
              <span className="text-xs text-muted">Шинэчилсэн: {formatDate(order.updatedAt)}</span>
            </Card>

            <Card className="flex flex-col gap-2 p-5">
              <h2 className="mb-1 font-semibold">Төлөв өөрчлөх</h2>
              {order.status === "cancelled" ? (
                <p className="text-sm text-muted">Цуцлагдсан захиалгыг өөрчлөх боломжгүй.</p>
              ) : (
                <>
                  {FLOW.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving || s === order.status}
                      onClick={() => setStatus(s)}
                      className={s === order.status ? `${btn.primary} justify-start` : `${btn.ghost} justify-start`}
                    >
                      {s === order.status ? "● " : ""}
                      {ORDER_STATUS_LABEL[s]}
                    </button>
                  ))}
                  <button type="button" disabled={saving} onClick={() => setStatus("cancelled")} className={`${btn.danger} justify-start`}>
                    Захиалга цуцлах
                  </button>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
