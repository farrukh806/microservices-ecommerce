const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001";
const PAYMENT_SERVICE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8002";

export const userApi = {
  async getUsers(params?: { page?: number; size?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.size) searchParams.set("size", String(params.size));
    if (params?.search) searchParams.set("search", params.search);

    const res = await fetch(`${PRODUCT_SERVICE_URL}/users?${searchParams}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getUser(id: string) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async updateUser(id: string, data: { firstName?: string; lastName?: string }) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete user");
  },
};

export const productApi = {
  async getProducts(params?: {
    page?: number;
    size?: number;
    category?: string;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "createdAt" | "price" | "name";
    sortOrder?: "asc" | "desc";
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.size) searchParams.set("size", String(params.size));
    if (params?.category && params.category !== "all") searchParams.set("category", params.category);
    if (params?.name) searchParams.set("name", params.name);
    if (params?.minPrice != null) searchParams.set("minPrice", String(params.minPrice));
    if (params?.maxPrice != null) searchParams.set("maxPrice", String(params.maxPrice));
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const res = await fetch(`${PRODUCT_SERVICE_URL}/products?${searchParams}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async getProduct(id: string) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  async createProduct(data: unknown) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },

  async updateProduct(id: string, data: unknown) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete product");
  },

  async getCategories() {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/categories`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async createCategory(data: unknown) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  async searchProducts(data: {
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
  }) {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to search products");
    return res.json();
  },

  async autocomplete(q: string, limit = 5) {
    const searchParams = new URLSearchParams({ q, limit: String(limit) });
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/autocomplete?${searchParams}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return res.json();
  },
};

export const cartApi = {
  async getCart() {
    const res = await fetch(`${ORDER_SERVICE_URL}/cart`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },

  async addItem(data: { productId: string; size: string; color: string; quantity?: number }) {
    const res = await fetch(`${ORDER_SERVICE_URL}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add item to cart");
    return res.json();
  },

  async updateItem(data: { productId: string; size: string; color: string; quantity: number }) {
    const res = await fetch(`${ORDER_SERVICE_URL}/cart/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update cart item");
    return res.json();
  },

  async removeItem(data: { productId: string; size: string; color: string }) {
    const res = await fetch(`${ORDER_SERVICE_URL}/cart/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to remove item from cart");
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${ORDER_SERVICE_URL}/cart`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to clear cart");
    return res.json();
  },
};

export const orderApi = {
  async createOrder(data: { shippingAddress: unknown; paymentMethod?: string }, couponCode?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (couponCode) headers["x-coupon-code"] = couponCode;

    const res = await fetch(`${ORDER_SERVICE_URL}/order`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  },

  async getOrders(params?: { page?: number; size?: number; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.size) searchParams.set("size", String(params.size));
    if (params?.status) searchParams.set("status", params.status);

    const res = await fetch(`${ORDER_SERVICE_URL}/order?${searchParams}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  async getOrder(id: string) {
    const res = await fetch(`${ORDER_SERVICE_URL}/order/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
  },

  async validateCoupon(code: string, orderSubtotal: number) {
    const res = await fetch(`${ORDER_SERVICE_URL}/orders/validate-coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code, orderSubtotal }),
    });
    if (!res.ok) throw new Error("Failed to validate coupon");
    return res.json();
  },
};

export const paymentApi = {
  async createPaymentIntent(orderId: string, amount: number, currency = "usd") {
    const res = await fetch(`${PAYMENT_SERVICE_URL}/payment/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderId, amount, currency }),
    });
    if (!res.ok) throw new Error("Failed to create payment intent");
    return res.json();
  },

  async getPayment(orderId: string) {
    const res = await fetch(`${PAYMENT_SERVICE_URL}/payment/${orderId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch payment");
    return res.json();
  },
};

export const wishlistApi = {
  async getWishlist() {
    const res = await fetch(`${ORDER_SERVICE_URL}/wishlist`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  },

  async addItem(data: { productId: string; size?: string; color?: string }) {
    const res = await fetch(`${ORDER_SERVICE_URL}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add to wishlist");
    return res.json();
  },

  async removeItem(productId: string, size?: string, color?: string) {
    const searchParams = new URLSearchParams({ productId });
    if (size) searchParams.set("size", size);
    if (color) searchParams.set("color", color);

    const res = await fetch(`${ORDER_SERVICE_URL}/wishlist/${productId}?${searchParams}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to remove from wishlist");
    return res.json();
  },
};

export const reviewApi = {
  async getReviews(params: { productId: string; page?: number; size?: number; sortBy?: string }) {
    const searchParams = new URLSearchParams({ productId: params.productId });
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.size) searchParams.set("size", String(params.size));
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);

    const res = await fetch(`${ORDER_SERVICE_URL}/reviews?${searchParams}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  async createReview(data: { productId: string; rating: number; title?: string; content?: string; photos?: string[] }) {
    const res = await fetch(`${ORDER_SERVICE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create review");
    return res.json();
  },

  async voteReview(id: string, helpful: boolean) {
    const res = await fetch(`${ORDER_SERVICE_URL}/reviews/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ helpful }),
    });
    if (!res.ok) throw new Error("Failed to vote on review");
    return res.json();
  },
};