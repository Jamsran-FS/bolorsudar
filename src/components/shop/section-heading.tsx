import { BookIcon } from "@/components/icons";

/** Centered uppercase title, muted subtitle and a hairline divider with a book glyph in the middle. */
export function SectionHeading({ title, subtitle, light = false, id }: { title: string; subtitle?: string; light?: boolean; id?: string }) {
  return (
    <div className="mb-10 flex flex-col items-center text-center md:mb-14">
      <h2 id={id} className={`font-display text-[22px] font-bold uppercase tracking-[.12em] md:text-[30px] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-2 text-[15px] ${light ? "text-white/70" : "text-muted"}`}>{subtitle}</p>}
      <div className={`mt-5 flex w-full max-w-[540px] items-center gap-4 ${light ? "text-white/60" : "text-muted"}`} aria-hidden="true">
        <span className={`h-px flex-1 ${light ? "bg-white/25" : "bg-line-strong"}`} />
        <BookIcon size={22} strokeWidth={1.3} />
        <span className={`h-px flex-1 ${light ? "bg-white/25" : "bg-line-strong"}`} />
      </div>
    </div>
  );
}
