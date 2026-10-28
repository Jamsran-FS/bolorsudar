import Link from "next/link";
import { Suspense } from "react";
import { BookGrid, BookGridSkeleton } from "@/components/shop/book-card";
import { SortSelect } from "@/components/shop/sort-select";
import { api, BookListParams, qs } from "@/lib/api";

export const metadata = { title: "Номууд" };

const LISTS = [
  { value: undefined, label: "Бүгд" },
  { value: "new", label: "Шинэ" },
  { value: "best", label: "Бэстселлер" },
  { value: "soon", label: "Тун удахгүй" },
  { value: "sale", label: "Хямдрал" },
] as const;

const PAGE_SIZE = 20;

type Search = Record<string, string | string[] | undefined>;

function pick(search: Search, key: string) {
  const v = search[key];
  return Array.isArray(v) ? v[0] : v;
}

export default function CatalogPage({ searchParams }: PageProps<"/books">) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-10">
      <Suspense fallback={<BookGridSkeleton count={10} />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: Promise<Search> }) {
  const search = await searchParams;
  const params: BookListParams = {
    list: pick(search, "list") as BookListParams["list"],
    category: pick(search, "category"),
    author: pick(search, "author"),
    q: pick(search, "q"),
    sort: pick(search, "sort"),
    page: Math.max(1, Number(pick(search, "page")) || 1),
    limit: PAGE_SIZE,
  };

  const [result, categories, authors] = await Promise.all([
    api.books(params).catch(() => null),
    api.categories().catch(() => []),
    params.author ? api.authors().catch(() => []) : Promise.resolve([]),
  ]);

  const category = categories.find((c) => c.slug === params.category);
  const author = authors.find((a) => a.slug === params.author);
  const title = params.q
    ? `"${params.q}" хайлтын үр дүн`
    : (author?.name ?? category?.name ?? LISTS.find((l) => l.value === params.list)?.label ?? "Бүх ном");

  // Builds a catalog URL from the current filters with some of them overridden
  const href = (patch: Partial<BookListParams>) => {
    const next = { ...params, page: undefined, limit: undefined, ...patch };
    return `/books${qs(next)}`;
  };

  const pages = result ? Math.ceil(result.total / PAGE_SIZE) : 0;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-[-0.02em] md:text-[38px]">{title}</h1>
          {result && <p className="mt-1 text-sm text-muted">{result.total} ном</p>}
        </div>
        <SortSelect />
      </div>

      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {LISTS.map((l) => {
          const on = params.list === l.value;
          return (
            <Link
              key={l.label}
              href={href({ list: l.value })}
              aria-current={on ? "true" : undefined}
              className={`flex-none rounded-full px-4 py-2.5 text-sm font-semibold ${on ? "bg-ink text-white hover:text-white" : "bg-surface text-ink"}`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Link
          href={href({ category: undefined })}
          className={`flex-none rounded-full border px-4 py-2 text-sm font-medium ${!params.category ? "border-brand text-brand" : "border-line text-body"}`}
        >
          Бүх ангилал
        </Link>
        {categories.map((c) => {
          const on = c.slug === params.category;
          return (
            <Link
              key={c.id}
              href={href({ category: c.slug })}
              className="flex-none rounded-full border px-4 py-2 text-sm font-medium"
              style={on ? { background: c.bg, color: c.fg, borderColor: c.bg } : { borderColor: "var(--color-line)" }}
            >
              {c.name}
            </Link>
          );
        })}
        {(params.author || params.q) && (
          <Link href="/books" className="flex-none rounded-full px-4 py-2 text-sm font-medium text-sale">
            Шүүлтүүр арилгах ✕
          </Link>
        )}
      </div>

      {!result ? (
        <p className="rounded-2xl bg-surface p-8 text-center text-muted">Номын жагсаалтыг ачаалж чадсангүй.</p>
      ) : result.items.length === 0 ? (
        <p className="rounded-2xl bg-surface p-8 text-center text-muted">Тохирох ном олдсонгүй.</p>
      ) : (
        <BookGrid books={result.items} />
      )}

      {pages > 1 && (
        <nav aria-label="Хуудаслалт" className="mt-12 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={href({ page: p })}
              aria-current={p === params.page ? "page" : undefined}
              className={`flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold ${
                p === params.page ? "bg-brand text-white hover:text-white" : "bg-surface text-ink"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
