import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-surface pb-24 md:pb-0">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 px-6 pb-8 pt-14">
        <div className="flex flex-col gap-3.5">
          <span className="font-display text-[22px] font-bold">{SITE.name}</span>
          <p className="text-sm leading-relaxed text-muted">Монгол хэл дээрх шилдэг номуудыг нэг дороос.</p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-[15px] font-bold">Дэлгүүр</span>
          <Link href="/books?list=new">Шинэ номууд</Link>
          <Link href="/books?list=best">Бэстселлер</Link>
          <Link href="/books?list=sale">Хямдрал</Link>
          <Link href="/#categories">Ангилал</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-[15px] font-bold">Тусламж</span>
          <span>Хүргэлтийн нөхцөл: {SITE.deliveryTime}</span>
          <span>Буцаалт: {SITE.returnPolicy}</span>
          <Link href="/authors">Зохиолчид</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-body">
          <span className="mb-1 text-[15px] font-bold text-ink">Холбоо барих</span>
          <span>{SITE.phone}</span>
          <span>{SITE.email}</span>
          <span>{SITE.address}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-3 border-t border-line px-6 pb-8 pt-5 text-[13px] text-muted">
        <span>© 2026 {SITE.name}. Бүх эрх хуулиар хамгаалагдсан.</span>
        <span className="flex gap-2">
          {SITE.socials.map((s, i) => (
            <span key={s.label}>
              {i > 0 && "· "}
              <a href={s.href} className="text-muted">
                {s.label}
              </a>
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}
