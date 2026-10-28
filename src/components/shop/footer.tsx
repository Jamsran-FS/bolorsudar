import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./header";

const heading = "mb-2 font-display text-sm font-bold uppercase tracking-[.12em] text-white";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 px-6 pb-12 pt-16">
        <div className="flex flex-col gap-4">
          <Logo light />
          <p className="text-sm leading-relaxed">Монгол хэл дээрх шилдэг номуудыг нэг дороос.</p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className={heading}>Дэлгүүр</span>
          <Link href="/books?list=new" className="text-white/70">Шинэ номууд</Link>
          <Link href="/books?list=best" className="text-white/70">Бэстселлер</Link>
          <Link href="/books?list=sale" className="text-white/70">Хямдрал</Link>
          <Link href="/#categories" className="text-white/70">Ангилал</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className={heading}>Тусламж</span>
          <span>Хүргэлт: {SITE.deliveryTime}</span>
          <span>Буцаалт: {SITE.returnPolicy}</span>
          <Link href="/authors" className="text-white/70">Зохиолчид</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className={heading}>Холбоо барих</span>
          <span>{SITE.phone}</span>
          <span>{SITE.email}</span>
          <span>{SITE.address}</span>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-3 px-6 py-6 text-[13px] text-white/50">
          <span>© 2026 {SITE.name}. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span className="flex gap-4">
            {SITE.socials.map((s) => (
              <a key={s.label} href={s.href} className="uppercase tracking-[.08em] text-white/60">
                {s.label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
