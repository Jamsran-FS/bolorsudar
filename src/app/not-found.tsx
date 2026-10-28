import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="font-display text-6xl font-bold text-brand">404</span>
      <h1 className="font-display text-2xl font-semibold">Хуудас олдсонгүй</h1>
      <p className="text-muted">Таны хайсан хуудас устсан эсвэл хаяг буруу байна.</p>
      <Link href="/" className="rounded-btn bg-brand px-6 py-3.5 font-display font-bold uppercase tracking-[.06em] text-white hover:bg-brand-dark hover:text-white">
        Нүүр хуудас руу буцах
      </Link>
    </div>
  );
}
