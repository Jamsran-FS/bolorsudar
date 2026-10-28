"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { BookCover } from "@/components/shop/book-cover";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SavedPage() {
  const { ready, saved, toggleSaved } = useStore();

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-10">
      <h1 className="mb-8 font-display text-[26px] font-bold tracking-[-0.02em] md:text-[38px]">Хадгалсан номууд</h1>
      {!ready ? null : saved.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[24px] bg-surface px-6 py-16 text-center">
          <p className="text-body">Та одоогоор ном хадгалаагүй байна. Номын хуудсан дээрх ♡ товчийг дарж хадгална уу.</p>
          <Link href="/books" className="rounded-full bg-brand px-6 py-3.5 font-semibold text-white hover:bg-brand-dark hover:text-white">
            Ном үзэх
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-[22px] sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-5 md:gap-y-7">
          {saved.map((b) => (
            <article key={b.id} className="flex min-w-0 flex-col gap-2">
              <Link href={`/books/${b.slug}`} tabIndex={-1} aria-hidden="true">
                <BookCover book={{ ...b, coverImage: null }} />
              </Link>
              {b.authorName && <span className="text-xs text-muted md:text-[13px]">{b.authorName}</span>}
              <Link href={`/books/${b.slug}`} className="text-sm font-semibold md:text-base">
                {b.title}
              </Link>
              <div className="flex items-center justify-between">
                <span className="font-bold">{formatPrice(b.price)}</span>
                <button
                  type="button"
                  aria-label={`Хасах: ${b.title}`}
                  onClick={() => toggleSaved(b)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-sale hover:bg-surface"
                >
                  <HeartIcon filled />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
