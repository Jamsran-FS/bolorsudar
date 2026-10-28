"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BagIcon, BookIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Нүүр" },
  { href: "/books", label: "Номууд" },
  { href: "/#categories", label: "Ангилал" },
  { href: "/authors", label: "Зохиолчид" },
  { href: "/books?list=new", label: "Шинэ" },
  { href: "/books?list=sale", label: "Хямдрал" },
  { href: "/#news", label: "Холбоо барих" },
];

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2 md:gap-2.5 ${light ? "text-white hover:text-white" : "text-ink"}`}>
      <span className={`flex items-center justify-center rounded-btn bg-brand text-white ${compact ? "h-[30px] w-[30px]" : "h-9 w-9"}`}>
        <BookIcon size={compact ? 16 : 20} strokeWidth={2.2} />
      </span>
      <span className={`font-display font-bold ${compact ? "text-[19px]" : "text-[22px]"}`}>{SITE.name}</span>
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
    <form action="/books" role="search" className={`flex min-h-10 items-center gap-2.5 rounded-btn bg-white/10 px-3.5 ${className}`}>
      <SearchIcon size={17} strokeWidth={2} className="text-white/60" />
      <label htmlFor={id} className="sr-only">
        Ном хайх
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
      />
    </form>
  );
}

function NavLinks({ pathname, onNavigate, vertical = false }: { pathname: string; onNavigate?: () => void; vertical?: boolean }) {
  return (
    <>
      {NAV.map((n) => {
        const active = n.href === "/" ? pathname === "/" : n.href === "/books" && pathname.startsWith("/books");
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap font-display font-semibold uppercase tracking-[.08em] ${
              vertical ? "rounded-btn px-3 py-3.5 text-[15px] hover:bg-white/5" : "px-2.5 py-2 text-[13px] xl:px-3 xl:text-sm"
            } ${active ? "text-brand" : "text-white hover:text-brand"}`}
          >
            {n.label}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  return <HeaderView pathname={usePathname()} />;
}

/** Rendered with an empty pathname as the Suspense fallback while the route is prerendered. */
export function HeaderView({ pathname }: { pathname: string }) {
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ink text-white shadow-[0_1px_0_rgba(255,255,255,.06)]">
      {/* Desktop */}
      <div className="mx-auto hidden min-h-[68px] max-w-[1180px] items-center gap-6 px-6 lg:flex">
        <Logo light />
        <nav aria-label="Үндсэн цэс" className="ml-auto flex items-center">
          <NavLinks pathname={pathname} />
        </nav>
        <SearchBox id="search" placeholder="Ном, зохиолч хайх" className="w-52 xl:w-60" />
        <div className="flex items-center">
          <Link href="/saved" aria-label="Хүслийн жагсаалт" className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 hover:text-white">
            <HeartIcon size={21} />
          </Link>
          <Link
            href="/cart"
            aria-label={`Сагс, ${cartCount} ном`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <BagIcon size={21} />
            <CartBadge />
          </Link>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-3 py-2.5">
          <button
            type="button"
            aria-label="Цэс нээх"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-white"
          >
            <MenuIcon size={24} />
          </button>
          <Logo compact light />
          <Link href="/cart" aria-label={`Сагс, ${cartCount} ном`} className="relative flex h-11 w-11 items-center justify-center text-white hover:text-white">
            <BagIcon />
            <CartBadge />
          </Link>
        </div>
        <div className="px-4 pb-3">
          <SearchBox id="msearch" placeholder="Ном, зохиолч хайх" className="min-h-11" />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Цэс">
          <button type="button" aria-label="Цэс хаах" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <nav className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-0.5 bg-ink p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo compact light />
              <button type="button" aria-label="Цэс хаах" onClick={() => setOpen(false)} className="flex h-11 w-11 cursor-pointer items-center justify-center text-white">
                <CloseIcon />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} vertical />
            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-btn px-3 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[.08em] text-white hover:bg-white/5"
            >
              Хадгалсан
            </Link>
          </nav>
        </div>
      )}
    </header>
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
    <nav aria-label="Доод цэс" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-white/10 bg-ink px-2 pb-5 pt-2 md:hidden">
      {BOTTOM.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-semibold ${active ? "text-brand hover:text-brand" : "text-white/70 hover:text-white"}`}
          >
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
