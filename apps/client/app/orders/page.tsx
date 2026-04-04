"use client";
import React, { useEffect, useState } from "react";
import { orderApi } from "@/lib/api-client";
import { LoaderCircle, Package, CheckCircle, Clock, XCircle } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: { label: "Pending", icon: <Clock className="w-4 h-4" />, color: "text-yellow-500" },
  CONFIRMED: { label: "Confirmed", icon: <CheckCircle className="w-4 h-4" />, color: "text-blue-500" },
  PROCESSING: { label: "Processing", icon: <Package className="w-4 h-4" />, color: "text-blue-500" },
  SHIPPED: { label: "Shipped", icon: <Package className="w-4 h-4" />, color: "text-purple-500" },
  DELIVERED: { label: "Delivered", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500" },
  CANCELLED: { label: "Cancelled", icon: <XCircle className="w-4 h-4" />, color: "text-red-500" },
};

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: Record<string, string>;
  createdAt: string;
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const config = statusConfig[order.status] ?? statusConfig.PENDING;

  return (
    <div className="shadow-xl p-5 rounded-md bg-white border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-500 font-mono">Order #{order.id.slice(0, 8)}</p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}x {item.name} ({item.size}/{item.color})
            </span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Shipping</span>
          <span>{order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tax</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-1">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data.items ?? []);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="my-5 max-w-3xl mx-auto px-4">
      <h1 className="text-xl font-semibold text-center mb-8">Your Orders</h1>

      {isLoading && (
        <div className="flex justify-center py-16">
          <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
