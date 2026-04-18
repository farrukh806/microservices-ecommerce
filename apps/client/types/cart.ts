import { type ICartItem } from "./product";

export type CartState = {
  products: ICartItem[];
  hydrated: boolean;
  isLoading: boolean;
};

export type CartActions = {
  addProduct: (product: ICartItem) => void;
  removeProduct: (productId: string, size: string, color: string) => void;
  setProducts: (products: ICartItem[]) => void;
  clearCart: () => void;
  setHydrated: (hydrated: boolean) => void;
  setLoading: (loading: boolean) => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  products: [],
  hydrated: false,
  isLoading: false,
};