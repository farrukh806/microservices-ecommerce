"use client";
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { PRODUCT_SERVICE_URL } from "@/lib/config";

interface LowStockItem {
  id: string;
  quantity: number;
  lowStockAlert: boolean;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function LowStockAlert() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/low-stock`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.slice(0, 5)); // Show top 5
      }
    } catch {
      // silent fail - don't break dashboard
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-2xl">✓</span>
          <p className="font-medium">All products well stocked</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold">Low Stock Alert</h3>
        </div>
        <Link href="/inventory" className="text-sm text-blue-600 hover:underline">
          Manage Inventory
        </Link>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <p className="text-sm font-medium">{item.product.name}</p>
              <p className="text-xs text-gray-500">${item.product.price.toFixed(2)}</p>
            </div>
            <span className={`text-sm font-medium ${item.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>
              {item.quantity === 0 ? "Out of stock" : `${item.quantity} left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}