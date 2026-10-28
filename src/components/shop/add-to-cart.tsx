"use client";

import { useState } from "react";
import { HeartIcon, PlusIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { BookCard } from "@/lib/types";

type Book = Pick<BookCard, "id" | "slug" | "title" | "authorName" | "price" | "coverColor" | "stock" | "isComingSoon">;

export function AddToCartIconButton({ book }: { book: Book }) {
  const { addToCart } = useStore();
  const unavailable = book.isComingSoon || book.stock <= 0;
  return (
    <button
      type="button"
      aria-label={unavailable ? "Одоогоор худалдаанд байхгүй" : `Сагсанд нэмэх: ${book.title}`}
      disabled={unavailable}
      onClick={() => addToCart(book)}
      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong"
    >
      <PlusIcon size={20} />
    </button>
  );
}

/** Quantity stepper + add button + wishlist toggle from the book detail page. */
export function BuyBox({ book }: { book: Book }) {
  const { addToCart, isSaved, toggleSaved } = useStore();
  const [qty, setQty] = useState(1);
  const unavailable = book.isComingSoon || book.stock <= 0;
  const max = Math.max(1, Math.min(99, book.stock));
  const saved = isSaved(book.id);

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1.5">
      <div className="flex items-center rounded-btn border border-line-strong p-1">
        <button
          type="button"
          aria-label="Тоо хасах"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={unavailable}
          className="h-11 w-11 cursor-pointer rounded-full text-[22px] hover:bg-surface disabled:opacity-40"
        >
          −
        </button>
        <span aria-live="polite" className="min-w-9 text-center text-[17px] font-bold">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Тоо нэмэх"
          onClick={() => setQty((q) => Math.min(max, q + 1))}
          disabled={unavailable}
          className="h-11 w-11 cursor-pointer rounded-full text-[22px] hover:bg-surface disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={unavailable}
        onClick={() => addToCart(book, qty)}
        className="min-h-[54px] flex-[1_1_200px] cursor-pointer rounded-btn bg-brand px-6 text-base font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong"
      >
        {book.isComingSoon ? "Удахгүй ирнэ" : unavailable ? "Дууссан" : `Сагсанд нэмэх · ${formatPrice(book.price * qty)}`}
      </button>
      <button
        type="button"
        aria-label={saved ? "Хүслийн жагсаалтаас хасах" : "Хүслийн жагсаалтад нэмэх"}
        aria-pressed={saved}
        onClick={() => toggleSaved(book)}
        className={`flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-btn border border-line-strong bg-white hover:bg-surface ${saved ? "text-sale" : "text-ink"}`}
      >
        <HeartIcon filled={saved} />
      </button>
    </div>
  );
}
