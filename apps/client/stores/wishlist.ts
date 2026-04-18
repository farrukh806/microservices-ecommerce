import { createStore } from "zustand/vanilla";
import {
  type WishlistItem,
  type WishlistState,
  type WishlistActions,
  type WishlistStore,
  defaultWishlistInitState,
} from "../types/wishlist";

export type { WishlistItem, WishlistState, WishlistActions, WishlistStore };
export { defaultWishlistInitState };

export const createWishlistStore = (initState: WishlistState = defaultWishlistInitState) => {
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