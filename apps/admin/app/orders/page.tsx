"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ORDER_SERVICE_URL } from "@/lib/config";

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
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
  userId: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ORDER_SERVICE_URL}/orders?size=100`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.items || []);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"} border-0`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-10 text-gray-500">No orders found</div>
          )}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.size} / {item.color} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
            <div className="text-sm">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
