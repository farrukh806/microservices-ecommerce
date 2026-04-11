import { createStore } from "zustand/vanilla";

export type WishlistItem = {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: Record<string, string>;
    inventory: { quantity: number } | null;
  };
  createdAt: Date;
};

export type WishlistState = {
  items: WishlistItem[];
  hydrated: boolean;
  isLoading: boolean;
};

export type WishlistActions = {
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  setHydrated: (hydrated: boolean) => void;
  setLoading: (loading: boolean) => void;
};

export type WishlistStore = WishlistState & WishlistActions;

export const defaultInitState: WishlistState = {
  items: [],
  hydrated: false,
  isLoading: false,
};

export const createWishlistStore = (initState: WishlistState = defaultInitState) => {
  return createStore<WishlistStore>()((set) => ({
    ...initState,

    setItems: (items) => set({ items }),

    addItem: (item) =>
      set((state) => {
        const exists = state.items.some(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color,
        );
        if (exists) return state;
        return { items: [...state.items, item] };
      }),

    removeItem: (productId) =>
      set((state) => ({
        items: state.items.filter((i) => i.productId !== productId),
      })),

    clearWishlist: () => set({ items: [] }),

    setHydrated: (hydrated) => set({ hydrated }),

    setLoading: (isLoading) => set({ isLoading }),
  }));
};