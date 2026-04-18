export interface ApiResponse {
  items: import("./product").IProduct[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SearchParams {
  page?: number;
  size?: number;
  category?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface SearchProductsParams {
  q?: string;
  page?: number;
  size?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string;
  colors?: string;
  minRating?: number;
  sortBy?: string;
  inStock?: string;
}

export interface CartItemParams {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
}

export interface UpdateCartItemParams {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface RemoveCartItemParams {
  productId: string;
  size: string;
  color: string;
}

export interface CreateOrderParams {
  shippingAddress: unknown;
  paymentMethod?: string;
}

export interface AddWishlistItemParams {
  productId: string;
  size?: string;
  color?: string;
}

export interface CreateReviewParams {
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  photos?: string[];
}

export interface GetReviewsParams {
  productId: string;
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface UserParams {
  firstName?: string;
  lastName?: string;
}

export interface UsersParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface OrdersParams {
  page?: number;
  size?: number;
  status?: string;
}

export interface ValidateCouponParams {
  code: string;
  orderSubtotal: number;
}

export interface PaymentIntentParams {
  orderId: string;
  amount: number;
  currency?: string;
}