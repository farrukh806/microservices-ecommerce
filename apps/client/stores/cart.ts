import { createStore } from "zustand/vanilla";
import { ICartItem } from "../types/product";

export type CartState = {
  products: ICartItem[];
};

export type CartActions = {
  addProduct: (product: ICartItem) => void;
  removeProduct: (productId: string, size: string, color: string) => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  products: [],
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()((set) => ({
    ...initState,

    addProduct: (product) =>
      set((state) => {
        const existingIndex = state.products.findIndex(
          (p) =>
            p.id === product.id &&
            p.size === product.size &&
            p.color === product.color,
        );

        // If product with same id + size + color exists → increase quantity
        if (existingIndex !== -1) {
          const updatedProducts = state.products.map((p, index) =>
            index === existingIndex
              ? { ...p, quantity: (p.quantity ?? 0) + (product.quantity ?? 1) }
              : p,
          );

          return { products: updatedProducts };
        }

        // Else add as new cart item
        return {
          products: [
            ...state.products,
            { ...product, quantity: product.quantity ?? product.quantity ?? 1 },
          ],
        };
      }),

    removeProduct: (productId, size, color) =>
      set((state) => {
        return {
          products:  state.products.filter(
            (p) =>
              !(p.id === productId && p.size === size && p.color === color),
          ),
        };
      }),
  }));
};
