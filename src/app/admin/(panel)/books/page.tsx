"use client";

import Link from "next/link";
import { useState } from "react";
import { btn, Card, Empty, ErrorNote, inputCls, Loading, PageHeader, Pagination, td, th } from "@/components/admin/ui";
import { BookCover } from "@/components/shop/book-cover";
import { qs } from "@/lib/api";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import { formatPrice } from "@/lib/format";
import type { BookCard, Category, Paginated } from "@/lib/types";

export default function AdminBooksPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paginated<BookCard>>(
    `/admin/books${qs({ q: search, category, page, limit: 20 })}`,
  );
  const categories = useAdminQuery<Category[]>("/admin/categories");
  const [actionError, setActionError] = useState<string | null>(null);

  async function remove(book: BookCard) {
    if (!confirm(`"${book.title}" номыг устгах уу?`)) return;
    try {
      await adminSend("DELETE", `/admin/books/${book.id}`);
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Устгаж чадсангүй");
    }
  }

  return (
    <>
      <PageHeader title="Номууд">
        <Link href="/admin/books/new" className={btn.primary}>
          + Шинэ ном
        </Link>
      </PageHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, зохиолч, ISBN…" className={`${inputCls} max-w-xs`} />
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className={`${inputCls} max-w-[220px]`}
          aria-label="Ангилал"
        >
          <option value="">Бүх ангилал</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className={btn.ghost}>
          Хайх
        </button>
      </form>

      <ErrorNote message={error || actionError} />
      {!data ? (
        loading && <Loading />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-line bg-surface/60">
                <tr>
                  <th className={th}>Ном</th>
                  <th className={th}>Ангилал</th>
                  <th className={`${th} text-right`}>Үнэ</th>
                  <th className={`${th} text-right`}>Үлдэгдэл</th>
                  <th className={th}>Шошго</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <BookCover book={b} size="sm" className="w-9 flex-none !p-0 [&>span]:hidden" />
                        <div className="min-w-0">
                          <Link href={`/admin/books/${b.id}`} className="font-semibold text-ink hover:text-brand">
                            {b.title}
                          </Link>
                          <div className="text-xs text-muted">{b.authorName ?? "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-body`}>{b.categoryName ?? "—"}</td>
                    <td className={`${td} text-right font-semibold`}>
                      {formatPrice(b.price)}
                      {b.oldPrice != null && b.oldPrice > b.price && <s className="block text-xs font-normal text-muted">{formatPrice(b.oldPrice)}</s>}
                    </td>
                    <td className={`${td} text-right ${b.stock <= 5 && !b.isComingSoon ? "font-semibold text-sale" : ""}`}>{b.stock}</td>
                    <td className={td}>
                      <div className="flex flex-wrap gap-1">
                        {!b.isPublished && <Chip className="bg-line text-body">Нуусан</Chip>}
                        {b.isNew && <Chip className="bg-brand-soft text-brand">Шинэ</Chip>}
                        {b.isBestseller && <Chip className="bg-[#FDF1D8] text-[#8A5A0B]">Бэстселлер</Chip>}
                        {b.isComingSoon && <Chip className="bg-lilac text-[#4B3F72]">Удахгүй</Chip>}
                        {b.isFeatured && <Chip className="bg-ink text-white">Онцлох</Chip>}
                      </div>
                    </td>
                    <td className={`${td} text-right`}>
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/books/${b.id}`} className={btn.ghost}>
                          Засах
                        </Link>
                        <button type="button" className={btn.danger} onClick={() => remove(b)}>
                          Устгах
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.items.length === 0 && <Empty>Ном олдсонгүй.</Empty>}
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </Card>
      )}
    </>
  );
}

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}
