import type { BookCard } from "@/lib/types";

type Size = "sm" | "md" | "lg" | "feature";

const SIZES: Record<Size, { pad: string; title: string; author: string; radius: string; shadow: string }> = {
  sm: { pad: "p-3", title: "text-[13px]", author: "text-[10px]", radius: "rounded-md", shadow: "shadow-[inset_6px_0_0_rgba(0,0,0,.18),0_8px_18px_rgba(21,23,28,.12)]" },
  md: { pad: "p-3 md:p-[18px]", title: "text-[13px] md:text-base", author: "text-[10px] md:text-[11px]", radius: "rounded-md md:rounded-lg", shadow: "shadow-cover" },
  lg: { pad: "p-7", title: "text-[28px]", author: "text-[13px]", radius: "rounded-[10px]", shadow: "shadow-cover-lg" },
  feature: { pad: "p-3 md:p-6", title: "text-[13px] md:text-2xl", author: "text-[10px] md:text-xs", radius: "rounded-md md:rounded-[10px]", shadow: "shadow-[inset_6px_0_0_rgba(0,0,0,.2)] md:shadow-[inset_10px_0_0_rgba(0,0,0,.2),0_30px_60px_rgba(0,0,0,.4)]" },
};

/** The flat, spine-shaded cover from the mockups. Uses the uploaded image when there is one. */
export function BookCover({
  book,
  size = "md",
  className = "",
  children,
}: {
  book: Pick<BookCard, "title" | "authorName" | "coverColor" | "coverImage">;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}) {
  const s = SIZES[size];
  if (book.coverImage) {
    return (
      <div className={`relative aspect-[2/3] overflow-hidden ${s.radius} ${s.shadow} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- covers come from arbitrary admin-supplied URLs */}
        <img src={book.coverImage} alt="" className="h-full w-full object-cover" />
        {children}
      </div>
    );
  }
  return (
    <div
      className={`relative flex aspect-[2/3] flex-col justify-between box-border ${s.pad} ${s.radius} ${s.shadow} ${className}`}
      style={{ background: book.coverColor }}
    >
      <span className={`font-display font-semibold leading-tight text-white ${s.title}`}>{book.title}</span>
      {book.authorName && (
        <span className={`uppercase tracking-[.06em] text-white/90 ${s.author}`}>{book.authorName}</span>
      )}
      {children}
    </div>
  );
}
