"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { BookCard } from "./types";

export interface CartLine {
  bookId: number;
  slug: string;
  title: string;
  authorName: string | null;
  price: number;
  coverColor: string;
  quantity: number;
}

export type SavedBook = Pick<BookCard, "id" | "slug" | "title" | "authorName" | "price" | "coverColor">;

interface Store {
  ready: boolean;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (book: Pick<BookCard, "id" | "slug" | "title" | "authorName" | "price" | "coverColor">, quantity?: number) => void;
  setQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  saved: SavedBook[];
  isSaved: (bookId: number) => boolean;
  toggleSaved: (book: SavedBook) => void;
  toast: string | null;
}

const StoreContext = createContext<Store | null>(null);

/**
 * A localStorage-backed value exposed through useSyncExternalStore, so the server
 * render (empty) and the hydrated client render agree, and other tabs stay in sync.
 */
function persisted<T>(key: string, empty: T) {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const load = (): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : empty;
    } catch {
      return empty;
    }
  };

  return {
    get: () => (value ??= load()),
    getServer: () => empty,
    set(next: T | ((prev: T) => T)) {
      value = typeof next === "function" ? (next as (prev: T) => T)(this.get()) : next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        value = load();
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

const EMPTY_CART: CartLine[] = [];
const EMPTY_SAVED: SavedBook[] = [];
const cartStore = persisted("huudas.cart", EMPTY_CART);
const savedStore = persisted("huudas.saved", EMPTY_SAVED);
const noopSubscribe = () => () => {};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer);
  const saved = useSyncExternalStore(savedStore.subscribe, savedStore.get, savedStore.getServer);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback<Store["addToCart"]>((book, quantity = 1) => {
    cartStore.set((lines) => {
      const existing = lines.find((l) => l.bookId === book.id);
      if (existing) {
        return lines.map((l) => (l.bookId === book.id ? { ...l, quantity: Math.min(l.quantity + quantity, 99) } : l));
      }
      return [
        ...lines,
        {
          bookId: book.id,
          slug: book.slug,
          title: book.title,
          authorName: book.authorName,
          price: book.price,
          coverColor: book.coverColor,
          quantity,
        },
      ];
    });
    setToast(`"${book.title}" сагсанд нэмэгдлээ`);
  }, []);

  const setQuantity = useCallback((bookId: number, quantity: number) => {
    cartStore.set((lines) => lines.map((l) => (l.bookId === bookId ? { ...l, quantity: Math.max(1, Math.min(quantity, 99)) } : l)));
  }, []);

  const removeFromCart = useCallback((bookId: number) => {
    cartStore.set((lines) => lines.filter((l) => l.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleSaved = useCallback((book: SavedBook) => {
    const { id, slug, title, authorName, price, coverColor } = book;
    savedStore.set((list) =>
      list.some((b) => b.id === id) ? list.filter((b) => b.id !== id) : [...list, { id, slug, title, authorName, price, coverColor }],
    );
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready,
      cart,
      cartCount: cart.reduce((n, l) => n + l.quantity, 0),
      cartTotal: cart.reduce((n, l) => n + l.quantity * l.price, 0),
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      saved,
      isSaved: (id) => saved.some((b) => b.id === id),
      toggleSaved,
      toast,
    }),
    [ready, cart, saved, toast, addToCart, setQuantity, removeFromCart, clearCart, toggleSaved],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg md:bottom-8"
        >
          {toast}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
