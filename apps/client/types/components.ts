import { ICartItem } from "./product";

export interface IAddToCartButton {
  product: ICartItem;
}

export interface ProductListProps {
  activeCategory: string;
}

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    content?: string | null;
    photos: string[];
    helpfulVotes: number;
    createdAt: Date | string;
    user: { firstName?: string | null; lastName?: string | null };
    orderId?: string | null;
  };
  onVote?: (reviewId: string, helpful: boolean) => void;
}

export interface SearchFiltersProps {
  facets: {
    categories: { slug: string; name: string; count: number }[];
    sizes: { value: string; count: number }[];
    colors: { value: string; count: number }[];
    priceRange: { min: number; max: number };
  };
  filters: {
    category?: string;
    sizes?: string;
    colors?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: string;
  };
  onFilterChange: (key: string, value: string | undefined) => void;
  onClear: () => void;
}

export interface ICartPricing {
  showContinueButton?: boolean;
}

export type PaymentStatus = "idle" | "processing" | "success" | "error";

export interface CreateCategoryProps {
  onSuccess?: (category: { slug: string; name: string }) => void;
  onCancel?: () => void;
}