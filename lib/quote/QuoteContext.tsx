"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface QuoteItem {
  id: string;
  nombre: string;
  sku: string | null;
  marca: string | null;
  precio: number | null;
  cantidad: number;
}

interface QuoteCtx {
  items: QuoteItem[];
  count: number;
  has: (id: string) => boolean;
  add: (item: Omit<QuoteItem, "cantidad">) => void;
  remove: (id: string) => void;
  setCantidad: (id: string, cantidad: number) => void;
  toggle: (item: Omit<QuoteItem, "cantidad">) => void;
  clear: () => void;
}

const Ctx = createContext<QuoteCtx | null>(null);
const STORAGE_KEY = "aaleres:cotizacion";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* almacenamiento no disponible */
    }
    setHydrated(true);
  }, []);

  // Persiste cambios
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add: QuoteCtx["add"] = useCallback((item) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, { ...item, cantidad: 1 }]
    );
  }, []);

  const remove: QuoteCtx["remove"] = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setCantidad: QuoteCtx["setCantidad"] = useCallback((id, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cantidad: Math.max(1, Math.round(cantidad) || 1) } : i
      )
    );
  }, []);

  const toggle: QuoteCtx["toggle"] = useCallback((item) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, cantidad: 1 }]
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteCtx>(
    () => ({
      items,
      count: items.length,
      has: (id) => items.some((i) => i.id === id),
      add,
      remove,
      setCantidad,
      toggle,
      clear,
    }),
    [items, add, remove, setCantidad, toggle, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote(): QuoteCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuote debe usarse dentro de <QuoteProvider>");
  return ctx;
}
