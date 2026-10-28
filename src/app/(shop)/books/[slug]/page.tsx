import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReturnIcon, TruckIcon } from "@/components/icons";
import { BuyBox } from "@/components/shop/add-to-cart";
import { BookGrid } from "@/components/shop/book-card";
import { BookCover } from "@/components/shop/book-cover";
import { BookTabs } from "@/components/shop/book-tabs";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

export default function BookPage({ params }: PageProps<"/books/[slug]">) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 md:px-6 md:pb-20">
      <Suspense fallback={<DetailSkeleton />}>
        <BookDetailView params={params} />
      </Suspense>
    </div>
  );
}

async function BookDetailView({ params }: { params: PageProps<"/books/[slug]">["params"] }) {
  const { slug } = await params;
  const [book, reviews] = await Promise.all([
    api.book(slug).catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    }),
    api.reviews(slug).catch(() => []),
  ]);

  const onSale = book.oldPrice != null && book.oldPrice > book.price;
  const availability = book.isComingSoon
    ? { text: "Удахгүй ирнэ", cls: "text-[#8A5A0B]" }
    : book.stock > 0
      ? { text: book.stock <= 5 ? `Цөөхөн үлдсэн (${book.stock})` : "Бэлэн байгаа", cls: "text-brand" }
      : { text: "Дууссан", cls: "text-sale" };

  return (
    <>
      <title>{`${book.title} – ${SITE.name}`}</title>
      <nav aria-label="Байршил" className="mb-6 flex flex-wrap gap-2 text-sm text-muted md:mb-8">
        <Link href="/" className="text-muted">
          Нүүр
        </Link>
        <span aria-hidden="true">/</span>
        {book.categorySlug && (
          <>
            <Link href={`/books?category=${book.categorySlug}`} className="text-muted">
              {book.categoryName}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-ink" aria-current="page">
          {book.title}
        </span>
      </nav>

      <div className="flex flex-wrap items-start gap-8 md:gap-14">
        <div
          className="flex min-w-0 flex-[1_1_380px] justify-center rounded-btn px-6 py-10 md:rounded-btn md:py-14"
          style={{ background: `color-mix(in srgb, ${book.coverColor} 14%, white)` }}
        >
          <BookCover book={book} size="lg" className="w-[220px] max-w-full md:w-[300px]" />
        </div>

        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5 md:gap-[22px]">
          <div className="flex flex-wrap gap-2">
            {book.categoryName && (
              <span className="rounded-btn bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand">{book.categoryName}</span>
            )}
            {book.badge && <span className="rounded-btn bg-surface px-3 py-1.5 text-[13px] font-semibold text-body">{book.badge}</span>}
          </div>
          <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[44px]">{book.title}</h1>
          {book.authorName && (
            <Link href={`/books?author=${book.authorSlug}`} className="text-lg font-medium text-brand">
              {book.authorName}
            </Link>
          )}
          <div className="flex flex-wrap items-baseline gap-3.5">
            <span className="font-display text-[28px] font-semibold md:text-[34px]">{formatPrice(book.price)}</span>
            {onSale && <s className="text-lg text-muted">{formatPrice(book.oldPrice!)}</s>}
            <span className={`text-sm font-semibold ${availability.cls}`}>● {availability.text}</span>
          </div>
          {book.summary && <p className="text-base leading-[1.7] text-body md:text-[17px]">{book.summary}</p>}

          <BuyBox book={book} />

          <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-brand">
              <TruckIcon />
              <span className="text-sm leading-snug text-ink">Хүргэлт: {SITE.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-brand">
              <ReturnIcon />
              <span className="text-sm leading-snug text-ink">Буцаалт: {SITE.returnPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      <BookTabs book={book} reviews={reviews} />

      {book.related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="mb-7 font-display text-xl font-bold uppercase tracking-[.08em] md:text-[28px]">Танд таалагдаж магадгүй</h2>
          <BookGrid books={book.related} />
        </section>
      )}
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-wrap gap-14">
      <div className="h-[440px] flex-[1_1_380px] animate-pulse rounded-btn bg-surface" />
      <div className="flex flex-[1_1_440px] flex-col gap-5">
        <div className="h-8 w-40 animate-pulse rounded-btn bg-surface" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-surface" />
        <div className="h-24 animate-pulse rounded bg-surface" />
      </div>
    </div>
  );
}
