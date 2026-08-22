import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/catalog";
import { effectivePrice } from "@/lib/catalog";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string | null;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "tymlyn-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((l) => l.id === product.id);
      if (found)
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          image: product.image,
          price: effectivePrice(product),
          qty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((l) => l.id !== id)),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
