export const config = {
  services: {
    product: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000",
    order: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8001",
    payment: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8002",
  },
} as const;

export const PRODUCT_SERVICE_URL = config.services.product;
export const ORDER_SERVICE_URL = config.services.order;
export const PAYMENT_SERVICE_URL = config.services.payment;