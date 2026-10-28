import Link from "next/link";
import { Suspense } from "react";
import { BookIcon, CategoryBookIcon, UserIcon } from "@/components/icons";
import { BookGridSkeleton } from "@/components/shop/book-card";
import { BookCover } from "@/components/shop/book-cover";
import { Newsletter } from "@/components/shop/newsletter";
import { SectionHeading } from "@/components/shop/section-heading";
import { ShelfTabs } from "@/components/shop/shelf-tabs";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const Container = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`mx-auto max-w-[1180px] px-4 md:px-6 ${className}`}>{children}</div>
);

function Unavailable() {
  return <p className="p-6 text-center text-muted">Мэдээлэл ачаалж чадсангүй. Түр хүлээгээд дахин оролдоно уу.</p>;
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<div className="h-[136px] bg-brand md:h-[170px]" />}>
        <Stats />
      </Suspense>

      <section id="categories" aria-labelledby="categories-title" className="scroll-mt-20 py-16 md:py-24">
        <Container>
          <SectionHeading id="categories-title" title="Ангилал" subtitle="Сонирхсон төрлөөрөө ном хайгаарай" />
          <Suspense fallback={<div className="h-48 animate-pulse bg-surface" />}>
            <Categories />
          </Suspense>
        </Container>
      </section>

      <section id="books" aria-labelledby="books-title" className="scroll-mt-20 bg-surface py-16 md:py-24">
        <Container>
          <SectionHeading id="books-title" title="Номын тавиур" subtitle="Шинээр ирсэн, хамгийн их борлогдсон, удахгүй ирэх номууд" />
          <Suspense fallback={<BookGridSkeleton />}>
            <Shelf />
          </Suspense>
        </Container>
      </section>

      <Suspense fallback={<div className="h-80 bg-night" />}>
        <Featured />
      </Suspense>

      <section id="authors" aria-labelledby="authors-title" className="scroll-mt-20 py-16 md:py-24">
        <Container>
          <SectionHeading id="authors-title" title="Зохиолчид" subtitle="Уншигчдын хамгийн их сонирхдог зохиолчид" />
          <Suspense fallback={<div className="h-40 animate-pulse bg-surface" />}>
            <Authors />
          </Suspense>
          <div className="mt-10 text-center">
            <Link
              href="/authors"
              className="inline-block rounded-btn border border-ink px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[.1em] text-ink hover:border-brand hover:bg-brand hover:text-white"
            >
              Бүх зохиолч
            </Link>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}

function Hero() {
  const covers = {
    back: { title: "Хоббит", authorName: "Ж.Р.Р. Толкин", coverColor: "#4A3426", coverImage: null },
    front: { title: "Клара, Нар хоёр", authorName: "Казүо Ишигүро", coverColor: "#1F3A5F", coverImage: null },
  };
  return (
    <section className="hero-backdrop relative overflow-hidden text-white">
      <Container className="flex min-h-[540px] flex-wrap items-center gap-10 py-14 md:min-h-[660px] md:py-24 lg:flex-nowrap">
        <div className="flex max-w-[540px] flex-col gap-6">
          <h1 className="font-display text-[36px] font-extrabold uppercase leading-[1.08] md:text-[58px]">Дараагийн дуртай номоо эндээс ол</h1>
          <p className="text-[17px] leading-relaxed text-white/85 md:text-lg">
            Уран зохиол, хүүхдийн ном, баримтат бүтээл, хувь хүний хөгжил. Хүссэн номоо хайж, гэрээсээ гаралгүй захиалаарай.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/books"
              className="rounded-btn bg-white px-8 py-4 font-display text-base font-bold uppercase tracking-[.06em] text-ink hover:bg-brand hover:text-white md:px-9 md:py-[18px] md:text-[17px]"
            >
              Ном үзэх
            </Link>
            <Link
              href="#categories"
              className="rounded-btn border border-white/40 px-8 py-4 font-display text-base font-bold uppercase tracking-[.06em] text-white hover:border-white hover:text-white md:px-9 md:py-[18px] md:text-[17px]"
            >
              Ангилал
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[300px] w-full max-w-[300px] sm:max-w-[400px] md:h-[440px] md:max-w-[440px]" aria-hidden="true">
          <div className="absolute left-[4%] top-[14%] w-[44%] -rotate-[7deg]">
            <BookCover book={covers.back} size="feature" />
          </div>
          <div className="absolute right-[6%] top-[4%] w-[48%] rotate-[3deg]">
            <BookCover book={covers.front} size="feature" />
          </div>
        </div>
      </Container>
    </section>
  );
}

async function Stats() {
  const data = await Promise.all([api.books({ limit: 1 }), api.authors(), api.categories()]).catch(() => null);
  if (!data) return <div className="h-[136px] bg-brand md:h-[170px]" />;
  const [books, authors, categories] = data;
  const items = [
    { Icon: BookIcon, value: books.total, label: "Ном" },
    { Icon: UserIcon, value: authors.length, label: "Зохиолч" },
    { Icon: CategoryBookIcon, value: categories.length, label: "Ангилал" },
  ];
  return (
    <section aria-label="Тоон үзүүлэлт" className="bg-brand text-white">
      <Container className="grid grid-cols-3 gap-4 py-9 md:py-14">
        {items.map(({ Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:gap-5 md:text-left">
            <Icon size={56} strokeWidth={1.1} className="h-10 w-10 md:h-14 md:w-14" />
            <div className="flex flex-col">
              <span className="font-display text-[26px] font-bold leading-none md:text-[34px]">{String(value).padStart(2, "0")}</span>
              <span className="mt-1 font-display text-xs uppercase tracking-[.14em] text-white/90 md:text-lg">{label}</span>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

async function Categories() {
  const categories = await api.categories().catch(() => null);
  if (!categories) return <Unavailable />;
  return (
    <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-14">
      {categories.map((c) => (
        <Link key={c.id} href={`/books?category=${c.slug}`} className="group flex items-start gap-5 text-ink">
          {/* Slanted tab, like a bookmark ribbon */}
          <span
            className="flex h-[76px] w-[46px] flex-none items-center justify-center bg-brand text-white transition-transform group-hover:-translate-y-1"
            style={{ clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 94%)" }}
          >
            <CategoryBookIcon size={24} strokeWidth={1.5} />
          </span>
          <span className="flex flex-col gap-2 pt-1">
            <span className="font-display text-lg font-bold uppercase tracking-[.1em] group-hover:text-brand">{c.name}</span>
            <span className="text-[15px] font-light leading-relaxed text-muted">
              {c.bookCount > 0 ? `${c.bookCount} ном · дэлгэрэнгүй үзэх →` : "Удахгүй нэмэгдэнэ"}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

async function Shelf() {
  const lists = await Promise.all([
    api.books({ list: "new", limit: 10 }),
    api.books({ list: "best", limit: 10 }),
    api.books({ list: "soon", limit: 10 }),
  ]).catch(() => null);
  if (!lists) return <Unavailable />;
  const [fresh, best, soon] = lists;
  return (
    <ShelfTabs
      tabs={[
        { id: "new", label: "Шинэ", books: fresh.items },
        { id: "best", label: "Бэстселлер", books: best.items },
        { id: "soon", label: "Тун удахгүй", books: soon.items },
      ]}
    />
  );
}

async function Featured() {
  const book = await api.featured().catch(() => null);
  if (!book) return null;
  const href = `/books/${book.slug}`;
  return (
    <section aria-labelledby="featured-title" className="bg-night text-white">
      <Container className="flex flex-wrap items-center gap-10 py-16 md:flex-nowrap md:gap-16 md:py-24">
        <Link href={href} className="mx-auto w-[180px] flex-none md:w-[260px]" tabIndex={-1} aria-hidden="true">
          <BookCover book={book} size="feature" />
        </Link>
        <div className="flex min-w-0 flex-col gap-5">
          <span className="font-display text-sm font-bold uppercase tracking-[.16em] text-brand">Сарын онцлох ном</span>
          <h2 id="featured-title" className="font-display text-[28px] font-extrabold uppercase leading-tight md:text-[44px]">
            {book.title}
          </h2>
          {book.authorName && <span className="text-white/70">{book.authorName}</span>}
          {book.summary && <p className="max-w-[600px] text-[17px] leading-relaxed text-white/75">{book.summary}</p>}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <span className="font-display text-[30px] font-bold">{formatPrice(book.price)}</span>
            <Link
              href={href}
              className="rounded-btn bg-brand px-8 py-4 font-display text-[15px] font-bold uppercase tracking-[.08em] text-white hover:bg-brand-dark hover:text-white"
            >
              Худалдаж авах
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

async function Authors() {
  const authors = await api.authors(true).catch(() => null);
  if (!authors) return <Unavailable />;
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {authors.map((a) => (
        <Link key={a.id} href={`/books?author=${a.slug}`} className="group flex flex-col items-center gap-4 text-center text-ink">
          <span
            className="flex h-24 w-24 items-center justify-center rounded-full font-display text-2xl font-bold ring-1 ring-line transition-transform group-hover:-translate-y-1 md:h-28 md:w-28"
            style={{ background: a.bg, color: a.fg }}
          >
            {a.initials}
          </span>
          <span className="font-display text-sm font-bold uppercase leading-snug tracking-[.06em] group-hover:text-brand">{a.name}</span>
        </Link>
      ))}
    </div>
  );
}
