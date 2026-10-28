"use client";

import Link from "next/link";
import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { BookCover } from "@/components/shop/book-cover";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

type Placed = { id: number; total: number };

const input = "min-h-12 w-full rounded-2xl border border-line-strong bg-white px-4 text-[15px] text-ink";

export default function CartPage() {
  const { ready, cart, cartTotal, setQuantity, removeFromCart, clearCart } = useStore();
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", address: "", note: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const order = await apiFetch<Placed>("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          email: form.email || undefined,
          note: form.note || undefined,
          items: cart.map((l) => ({ bookId: l.bookId, quantity: l.quantity })),
        }),
      });
      setPlaced(order);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Захиалга илгээхэд алдаа гарлаа");
    } finally {
      setSending(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint text-3xl text-brand">✓</span>
        <h1 className="font-display text-[26px] font-bold">Захиалга хүлээн авлаа</h1>
        <p className="text-body">
          Таны захиалгын дугаар <strong>#{placed.id}</strong>, нийт дүн <strong>{formatPrice(placed.total)}</strong>. Бид удахгүй
          холбогдож баталгаажуулна.
        </p>
        <Link href="/books" className="mt-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white hover:bg-brand-dark hover:text-white">
          Үргэлжлүүлэн дэлгүүрлэх
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-10">
      <h1 className="mb-8 font-display text-[26px] font-bold tracking-[-0.02em] md:text-[38px]">Сагс</h1>

      {!ready ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[24px] bg-surface px-6 py-16 text-center">
          <p className="text-body">Таны сагс хоосон байна.</p>
          <Link href="/books" className="rounded-full bg-brand px-6 py-3.5 font-semibold text-white hover:bg-brand-dark hover:text-white">
            Ном сонгох
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-8 lg:gap-12">
          <ul className="flex min-w-0 flex-[1_1_480px] flex-col divide-y divide-line">
            {cart.map((l) => (
              <li key={l.bookId} className="flex gap-4 py-5 first:pt-0">
                <Link href={`/books/${l.slug}`} className="w-20 flex-none" tabIndex={-1} aria-hidden="true">
                  <BookCover book={{ ...l, coverImage: null }} size="sm" className="[&>span]:hidden" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {l.authorName && <span className="text-[13px] text-muted">{l.authorName}</span>}
                  <Link href={`/books/${l.slug}`} className="font-semibold leading-snug">
                    {l.title}
                  </Link>
                  <span className="text-sm text-muted">{formatPrice(l.price)}</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center rounded-full border border-line-strong p-0.5">
                      <button
                        type="button"
                        aria-label="Тоо хасах"
                        onClick={() => setQuantity(l.bookId, l.quantity - 1)}
                        className="h-10 w-10 cursor-pointer rounded-full text-xl hover:bg-surface"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-bold">{l.quantity}</span>
                      <button
                        type="button"
                        aria-label="Тоо нэмэх"
                        onClick={() => setQuantity(l.bookId, l.quantity + 1)}
                        className="h-10 w-10 cursor-pointer rounded-full text-xl hover:bg-surface"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold">{formatPrice(l.price * l.quantity)}</span>
                    <button
                      type="button"
                      aria-label={`Хасах: ${l.title}`}
                      onClick={() => removeFromCart(l.bookId)}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface hover:text-sale"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 rounded-[24px] border border-line p-6">
            <h2 className="font-display text-lg font-semibold">Хүргэлтийн мэдээлэл</h2>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Нэр *
              <input required minLength={2} value={form.customerName} onChange={set("customerName")} className={input} autoComplete="name" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Утасны дугаар *
              <input required minLength={6} type="tel" value={form.phone} onChange={set("phone")} className={input} autoComplete="tel" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Имэйл
              <input type="email" value={form.email} onChange={set("email")} className={input} autoComplete="email" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Хаяг *
              <textarea
                required
                minLength={5}
                rows={3}
                value={form.address}
                onChange={set("address")}
                className={`${input} py-3`}
                placeholder="Дүүрэг, хороо, байр, тоот"
                autoComplete="street-address"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Нэмэлт тэмдэглэл
              <textarea rows={2} value={form.note} onChange={set("note")} className={`${input} py-3`} />
            </label>

            <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
              <span className="text-muted">Нийт дүн</span>
              <span className="font-display text-2xl font-semibold">{formatPrice(cartTotal)}</span>
            </div>
            {error && (
              <p role="alert" className="rounded-xl bg-[#F6E6E3] px-4 py-3 text-sm text-sale">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="min-h-[54px] cursor-pointer rounded-full bg-brand text-base font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {sending ? "Илгээж байна…" : "Захиалга өгөх"}
            </button>
            <p className="text-center text-xs text-muted">Төлбөрийг хүргэлтийн үед эсвэл баталгаажуулах үед төлнө.</p>
          </form>
        </div>
      )}
    </div>
  );
}
