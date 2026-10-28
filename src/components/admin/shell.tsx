"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon } from "@/components/icons";
import { Logo } from "@/components/shop/header";
import { adminFetch, getToken, setToken } from "@/lib/admin-api";

const NAV = [
  { href: "/admin", label: "Хянах самбар", exact: true },
  { href: "/admin/orders", label: "Захиалга" },
  { href: "/admin/books", label: "Номууд" },
  { href: "/admin/categories", label: "Ангилал" },
  { href: "/admin/authors", label: "Зохиолчид" },
  { href: "/admin/reviews", label: "Сэтгэгдэл" },
  { href: "/admin/subscribers", label: "Захиалагчид" },
];

type Me = { id: number; email: string; name: string; role: string };

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    adminFetch<Me>("/auth/me")
      .then((u) => {
        if (u.role !== "admin") throw new Error("forbidden");
        setMe(u);
      })
      .catch(() => {
        setToken(null);
        router.replace("/admin/login");
      });
  }, [router]);

  if (!me) {
    return <div className="flex flex-1 items-center justify-center text-sm text-muted">Ачаалж байна…</div>;
  }

  const logout = () => {
    setToken(null);
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen flex-1 bg-surface">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col gap-1 border-r border-line bg-white p-4 transition-transform lg:static lg:translate-x-0 ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 px-2">
          <Logo compact />
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-muted">Админ</span>
        </div>
        <nav aria-label="Админ цэс" className="flex flex-col gap-0.5">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenu(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-mint text-brand" : "text-body hover:bg-surface"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <span className="truncate px-3 text-muted">{me.email}</span>
          <Link href="/" target="_blank" className="rounded-xl px-3 py-2 text-body hover:bg-surface">
            Дэлгүүр үзэх ↗
          </Link>
          <button type="button" onClick={logout} className="cursor-pointer rounded-xl px-3 py-2 text-left text-sale hover:bg-[#F6E6E3]">
            Гарах
          </button>
        </div>
      </aside>
      {menu && <button type="button" aria-label="Цэс хаах" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMenu(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <button type="button" aria-label="Цэс нээх" onClick={() => setMenu(true)} className="flex h-10 w-10 cursor-pointer items-center justify-center">
            <MenuIcon />
          </button>
          <span className="font-display font-semibold">Админ</span>
        </header>
        <main className="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
