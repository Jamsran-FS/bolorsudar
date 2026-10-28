import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon, CategoryBookIcon } from "@/components/icons";
import { BookGridSkeleton } from "@/components/shop/book-card";
import { BookCover } from "@/components/shop/book-cover";
import { Newsletter } from "@/components/shop/newsletter";
import { ShelfTabs } from "@/components/shop/shelf-tabs";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const Section = ({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) => (
  <section id={id} className={`mx-auto max-w-[1280px] px-4 md:px-6 ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ title, href, cta }: { title: string; href?: string; cta?: string }) => (
  <div className="mb-3.5 flex flex-wrap items-end justify-between gap-4 md:mb-7">
    <h2 className="font-display text-[19px] font-semibold tracking-[-0.02em] md:text-[30px]">{title}</h2>
    {href && (
      <Link href={href} className="py-2.5 text-sm font-semibold text-brand md:text-[15px]">
        {cta} →
      </Link>
    )}
  </div>
);

function Unavailable() {
  return <p className="rounded-2xl bg-surface p-6 text-center text-muted">Мэдээлэл ачаалж чадсангүй. Түр хүлээгээд дахин оролдоно уу.</p>;
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section id="categories" className="pt-7 md:pt-[72px]">
        <SectionTitle title="Ангиллаар хайх" href="/books" cta="Бүх ангилал" />
        <Suspense fallback={<div className="h-[120px] animate-pulse rounded-[20px] bg-surface" />}>
          <Categories />
        </Suspense>
      </Section>

      <Section id="books" className="pt-7 md:pt-[72px]">
        <Suspense fallback={<BookGridSkeleton />}>
          <Shelf />
        </Suspense>
      </Section>

      <Section className="pt-8 md:pt-20">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[28px] bg-surface" />}>
          <Featured />
        </Suspense>
      </Section>

      <Section id="authors" className="pt-8 md:pt-20">
        <SectionTitle title="Алдартай зохиолчид" href="/authors" cta="Бүх зохиолч" />
        <Suspense fallback={<div className="h-40 animate-pulse rounded-[20px] bg-surface" />}>
          <Authors />
        </Suspense>
      </Section>

      <Newsletter />
    </>
  );
}

function Hero() {
  const covers = {
    left: { title: "Хоббит", authorName: "Ж.Р.Р. Толкин", coverColor: "#4B3F72", coverImage: null },
    right: { title: "Амьтны ферм", authorName: "Жорж Оруэлл", coverColor: "#9E4130", coverImage: null },
    center: { title: "Клара, Нар хоёр", authorName: "Казүо Ишигүро", coverColor: "#1F3A5F", coverImage: null },
  };
  return (
    <Section className="pt-4 md:pt-8">
      <div className="flex flex-wrap items-center gap-3.5 overflow-hidden rounded-[24px] bg-mint px-[22px] pt-[26px] md:gap-12 md:rounded-[28px] md:p-14">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 md:gap-6">
          <span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand md:px-3.5 md:py-2 md:text-[13px]">
            Намрын шинэ номууд ирлээ
          </span>
          <h1 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[52px] md:tracking-[-0.03em]">
            Дараагийн дуртай номоо эндээс ол
          </h1>
          <p className="hidden max-w-[520px] text-lg leading-relaxed text-body md:block">
            Уран зохиол, хүүхдийн ном, баримтат бүтээл, хувь хүний хөгжил. Хүссэн номоо хайж, гэрээсээ гаралгүй захиалаарай.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-[22px] py-[13px] text-[15px] font-semibold text-white hover:bg-brand-dark hover:text-white md:px-[26px] md:py-[15px] md:text-base"
            >
              Номын сан үзэх
              <ArrowRightIcon size={18} className="hidden md:block" />
            </Link>
            <Link href="#categories" className="hidden rounded-full bg-white px-[26px] py-[15px] text-base font-semibold text-ink hover:bg-surface md:inline-block">
              Ангилал харах
            </Link>
          </div>
        </div>
        <div className="relative mt-1.5 h-[190px] min-w-0 flex-[1_1_380px] md:mt-0 md:h-[400px]" aria-hidden="true">
          <BookCover book={covers.left} className="absolute left-[6%] top-10 w-[110px] -rotate-[8deg] md:left-[4%] md:top-[60px] md:w-[38%]" />
          <BookCover book={covers.right} className="absolute right-[6%] top-9 w-[110px] rotate-[8deg] md:right-[4%] md:top-[50px] md:w-[38%]" />
          <BookCover book={covers.center} className="absolute left-1/2 top-2 w-[124px] -translate-x-1/2 md:top-2.5 md:w-[44%]" />
        </div>
      </div>
    </Section>
  );
}

async function Categories() {
  const categories = await api.categories().catch(() => null);
  if (!categories) return <Unavailable />;
  return (
    <>
      {/* Mobile: horizontal chip rail */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/books?category=${c.slug}`}
            className="flex-none whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold"
            style={{ background: c.bg, color: c.fg }}
          >
            {c.name}
          </Link>
        ))}
      </div>
      {/* Desktop: tiles */}
      <div className="hidden grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:grid">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/books?category=${c.slug}`}
            className="flex flex-col gap-7 rounded-[20px] border border-line bg-white p-[22px] hover:border-line-strong"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px]" style={{ background: c.bg, color: c.fg }}>
              <CategoryBookIcon size={24} />
            </span>
            <span className="text-[17px] font-semibold text-ink">{c.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

async function Shelf() {
  const lists = await Promise.all([
    api.books({ list: "new", limit: 10 }),
    api.books({ list: "best", limit: 10 }),
    api.books({ list: "soon", limit: 10 }),
  ]).catch(() => null);
  if (!lists) {
    return (
      <>
        <SectionTitle title="Номын тавиур" />
        <Unavailable />
      </>
    );
  }
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
    <div className="flex flex-wrap items-center gap-[18px] rounded-[24px] bg-ink p-6 text-white md:gap-14 md:rounded-[28px] md:p-14">
      <Link href={href} className="w-24 flex-none md:mx-auto md:w-[260px]" tabIndex={-1} aria-hidden="true">
        <BookCover book={book} size="feature" />
      </Link>
      <div className="flex min-w-0 flex-[1_1_180px] flex-col gap-2 md:flex-[1_1_420px] md:gap-5">
        <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-gold md:text-sm">Сарын онцлох ном</span>
        <h2 className="font-display text-base font-semibold leading-tight md:text-[38px] md:tracking-[-0.02em]">{book.title}</h2>
        {book.authorName && <span className="text-[13px] text-line-strong md:hidden">{book.authorName}</span>}
        {book.summary && <p className="hidden max-w-[560px] text-[17px] leading-relaxed text-line-strong md:block">{book.summary}</p>}
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-base font-bold md:font-display md:text-[28px] md:font-semibold">{formatPrice(book.price)}</span>
          <Link href={href} className="hidden rounded-full bg-gold px-[26px] py-[15px] text-base font-bold text-ink hover:text-ink md:inline-block">
            Дэлгэрэнгүй үзэх
          </Link>
        </div>
      </div>
    </div>
  );
}

async function Authors() {
  const authors = await api.authors(true).catch(() => null);
  if (!authors) return <Unavailable />;
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:gap-5">
      {authors.map((a) => (
        <Link key={a.id} href={`/books?author=${a.slug}`} className="flex flex-col items-center gap-3.5 p-2 text-center">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-semibold md:h-28 md:w-28 md:text-[30px]"
            style={{ background: a.bg, color: a.fg }}
          >
            {a.initials}
          </span>
          <span className="text-sm font-semibold leading-snug md:text-[15px]">{a.name}</span>
        </Link>
      ))}
    </div>
  );
}
