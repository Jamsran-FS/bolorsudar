import Link from "next/link";
import { Suspense } from "react";
import { api } from "@/lib/api";

export const metadata = { title: "Зохиолчид" };

export default function AuthorsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-10">
      <h1 className="mb-8 font-display text-[26px] font-bold tracking-[-0.02em] md:text-[38px]">Зохиолчид</h1>
      <Suspense fallback={<div className="h-60 animate-pulse rounded-[24px] bg-surface" />}>
        <AuthorList />
      </Suspense>
    </div>
  );
}

async function AuthorList() {
  const authors = await api.authors().catch(() => null);
  if (!authors) return <p className="rounded-2xl bg-surface p-8 text-center text-muted">Жагсаалтыг ачаалж чадсангүй.</p>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {authors.map((a) => (
        <Link
          key={a.id}
          href={`/books?author=${a.slug}`}
          className="flex items-center gap-4 rounded-[20px] border border-line p-4 hover:border-line-strong"
        >
          <span
            className="flex h-14 w-14 flex-none items-center justify-center rounded-full font-display text-lg font-semibold"
            style={{ background: a.bg, color: a.fg }}
          >
            {a.initials}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-semibold leading-snug text-ink">{a.name}</span>
            <span className="text-sm text-muted">{a.bookCount} ном</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
