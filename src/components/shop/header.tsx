"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BagIcon, BookIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/books", label: "Номууд" },
  { href: "/#categories", label: "Ангилал" },
  { href: "/authors", label: "Зохиолчид" },
  { href: "/books?list=new", label: "Шинэ" },
  { href: "/books?list=sale", label: "Хямдрал", sale: true },
  { href: "/#news", label: "Мэдээ" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 md:gap-2.5 text-ink">
      <span
        className={`flex items-center justify-center bg-brand text-white ${compact ? "h-[30px] w-[30px] rounded-[9px]" : "h-9 w-9 rounded-[10px]"}`}
      >
        <BookIcon size={compact ? 16 : 20} strokeWidth={2.2} />
      </span>
      <span className={`font-display font-bold tracking-[-0.02em] ${compact ? "text-[19px]" : "text-[22px]"}`}>
        {SITE.name}
      </span>
    </Link>
  );
}

function CartBadge() {
  const { cartCount, ready } = useStore();
  if (!ready || cartCount === 0) return null;
  return (
    <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  );
}

function SearchBox({ id, placeholder, className = "" }: { id: string; placeholder: string; className?: string }) {
  return (
    <form action="/books" role="search" className={`flex min-h-11 items-center gap-2.5 rounded-full bg-surface px-4 ${className}`}>
      <SearchIcon size={18} strokeWidth={2} className="text-muted" />
      <label htmlFor={id} className="sr-only">
        Ном хайх
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
      />
    </form>
  );
}

export function Header() {
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden bg-ink px-6 py-2.5 text-center text-[13px] text-white md:block">
        Улаанбаатар хотод хүргэлттэй · Захиалга: {SITE.phone}
      </div>

      {/* Desktop */}
      <header className="hidden border-b border-line md:block">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-6 px-6 py-[18px]">
          <Logo />
          <nav aria-label="Үндсэн цэс" className="flex flex-wrap gap-1 text-[15px] font-medium">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`px-3 py-2.5 ${n.sale ? "text-sale" : "text-ink"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <SearchBox id="search" placeholder="Ном, зохиолч, ISBN хайх" className="flex-[1_1_240px]" />
          <div className="flex items-center gap-1">
            <Link href="/saved" aria-label="Хүслийн жагсаалт" className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface">
              <HeartIcon />
            </Link>
            <Link
              href="/cart"
              aria-label={`Сагс, ${cartCount} ном`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
            >
              <BagIcon />
              <CartBadge />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile */}
      <header className="md:hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <button
            type="button"
            aria-label="Цэс нээх"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center"
          >
            <MenuIcon size={24} />
          </button>
          <Logo compact />
          <Link href="/cart" aria-label={`Сагс, ${cartCount} ном`} className="relative flex h-11 w-11 items-center justify-center text-ink">
            <BagIcon />
            <CartBadge />
          </Link>
        </div>
        <div className="px-4 pt-3.5">
          <SearchBox id="msearch" placeholder="Ном, зохиолч хайх" className="min-h-[46px]" />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Цэс">
          <button type="button" aria-label="Цэс хаах" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <nav className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-1 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <Logo compact />
              <button type="button" aria-label="Цэс хаах" onClick={() => setOpen(false)} className="flex h-11 w-11 cursor-pointer items-center justify-center">
                <CloseIcon />
              </button>
            </div>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-base font-medium hover:bg-surface ${n.sale ? "text-sale" : "text-ink"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

const BOTTOM = [
  { href: "/", label: "Нүүр", Icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/books", label: "Номууд", Icon: GridIcon, match: (p: string) => p.startsWith("/books") },
  { href: "/saved", label: "Хадгалсан", Icon: HeartIcon, match: (p: string) => p.startsWith("/saved") },
  { href: "/cart", label: "Сагс", Icon: BagIcon, match: (p: string) => p.startsWith("/cart") },
];

export function BottomNav() {
  return <BottomNavView pathname={usePathname()} />;
}

/** Rendered with an empty pathname as the Suspense fallback while the route is prerendered. */
export function BottomNavView({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Доод цэс"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white px-2 pb-5 pt-2 md:hidden"
    >
      {BOTTOM.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-semibold ${active ? "text-brand" : "text-muted"}`}
          >
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
