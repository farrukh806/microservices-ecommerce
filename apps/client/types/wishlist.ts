import { IProduct } from "./product";

export interface WishlistItem {
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
}

export interface WishlistState {
  items: WishlistItem[];
  hydrated: boolean;
  isLoading: boolean;
}

export interface WishlistActions {
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  setHydrated: (hydrated: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export type WishlistStore = WishlistState & WishlistActions;

export const defaultWishlistInitState: WishlistState = {
  items: [],
  hydrated: false,
  isLoading: false,
};