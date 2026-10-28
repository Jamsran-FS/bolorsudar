"use client";

import { useState } from "react";
import type { BookCard } from "@/lib/types";
import { BookGrid } from "./book-card";

type Tab = { id: string; label: string; books: BookCard[] };

export function ShelfTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <>
      <div role="tablist" aria-label="Номын жагсаалт" className="no-scrollbar mb-10 flex justify-center gap-2 overflow-x-auto md:gap-6">
        {tabs.map((t) => {
          const on = t.id === current?.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`min-h-11 shrink-0 cursor-pointer border-b-2 px-3 font-display text-sm font-bold uppercase tracking-[.12em] md:text-[15px] ${
                on ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {current && (
        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
          {current.books.length ? (
            <BookGrid books={current.books} />
          ) : (
            <p className="bg-white p-8 text-center text-muted">Энэ жагсаалтад одоогоор ном алга.</p>
          )}
        </div>
      )}
    </>
  );
}
