"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart,
  createCart,
  getCart,
  updateCartLine,
  type Cart,
  type CartLine,
  type Money,
} from "@/lib/shopify";

const CART_ID_STORAGE_KEY = "sleepifyme_cart_id";

const EMPTY_SUBTOTAL: Money = { amount: "0", currencyCode: "INR" };

type CartContextValue = {
  cart: Cart | null;
  items: CartLine[];
  subtotal: Money;
  itemCount: number;
  isInitializing: boolean;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isInitializing, setIsInitializing] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(CART_ID_STORAGE_KEY))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!storedId) return;

    let cancelled = false;

    (async () => {
      try {
        const existingCart = await getCart(storedId);
        if (cancelled) return;

        if (existingCart) {
          setCart(existingCart);
        } else {
          localStorage.removeItem(CART_ID_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(CART_ID_STORAGE_KEY);
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        if (!cart) {
          const newCart = await createCart(variantId, quantity);
          localStorage.setItem(CART_ID_STORAGE_KEY, newCart.id);
          setCart(newCart);
        } else {
          const updated = await addToCart(cart.id, variantId, quantity);
          setCart(updated);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await updateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    (lineId: string) => updateItem(lineId, 0),
    [updateItem]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart?.lines ?? [],
      subtotal: cart?.subtotal ?? EMPTY_SUBTOTAL,
      itemCount: cart?.totalQuantity ?? 0,
      isInitializing,
      isLoading,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateItem,
      removeItem,
    }),
    [
      cart,
      isInitializing,
      isLoading,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateItem,
      removeItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
