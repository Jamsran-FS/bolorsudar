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
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[19px] font-semibold tracking-[-0.02em] md:text-[30px]">Номын тавиур</h2>
        <div role="tablist" aria-label="Номын жагсаалт" className="flex flex-wrap gap-1.5 rounded-full bg-surface p-[5px]">
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
                className={`min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold md:px-5 md:text-[15px] ${
                  on ? "bg-white text-ink shadow-[0_1px_3px_rgba(21,23,28,.12)]" : "text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {current && (
        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
          {current.books.length ? (
            <BookGrid books={current.books} />
          ) : (
            <p className="rounded-2xl bg-surface p-8 text-center text-muted">Энэ жагсаалтад одоогоор ном алга.</p>
          )}
        </div>
      )}
    </>
  );
}
