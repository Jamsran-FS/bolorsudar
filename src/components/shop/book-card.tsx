import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { BookCard } from "@/lib/types";
import { AddToCartIconButton } from "./add-to-cart";
import { BookCover } from "./book-cover";

export function BookCardItem({ book, showActions = true }: { book: BookCard; showActions?: boolean }) {
  const href = `/books/${book.slug}`;
  const onSale = book.oldPrice != null && book.oldPrice > book.price;
  return (
    <article className="group flex min-w-0 flex-col gap-2 md:gap-3">
      <Link href={href} className="block transition-transform duration-200 group-hover:-translate-y-1" tabIndex={-1} aria-hidden="true">
        <BookCover book={book}>
          {book.tag && (
            <span className="absolute -right-1.5 top-3 rounded-md bg-gold px-2.5 py-1 text-xs font-bold text-ink">{book.tag}</span>
          )}
          {!book.tag && onSale && (
            <span className="absolute -right-1.5 top-3 rounded-md bg-sale px-2.5 py-1 text-xs font-bold text-white">
              −{Math.round((1 - book.price / book.oldPrice!) * 100)}%
            </span>
          )}
        </BookCover>
      </Link>
      <div className="flex flex-col gap-1">
        {book.authorName && <span className="text-xs text-muted md:text-[13px]">{book.authorName}</span>}
        <Link href={href} className="text-sm font-semibold leading-snug md:text-base">
          {book.title}
        </Link>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="flex flex-col leading-tight">
          {onSale && <s className="text-xs text-muted">{formatPrice(book.oldPrice!)}</s>}
          <span className="text-[15px] font-bold md:text-[17px]">{formatPrice(book.price)}</span>
        </span>
        {showActions && <AddToCartIconButton book={book} />}
      </div>
    </article>
  );
}

export function BookGrid({ books, actions = true }: { books: BookCard[]; actions?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-[22px] sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-5 md:gap-y-7">
      {books.map((b) => (
        <BookCardItem key={b.id} book={b} showActions={actions} />
      ))}
    </div>
  );
}

export function BookGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-[22px] sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-5 md:gap-y-7">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}
