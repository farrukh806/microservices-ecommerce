"use client";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { PRODUCT_SERVICE_URL } from "@/lib/config";

interface InventoryItem {
  id: string;
  quantity: number;
  reservedQty: number;
  lowStockAlert: boolean;
  backInStockEnabled: boolean;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/inventory?size=100`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string) => {
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: editQuantity }),
      });
      if (res.ok) {
        toast.success("Inventory updated");
        setEditingId(null);
        fetchInventory();
      } else {
        toast.error("Failed to update inventory");
      }
    } catch {
      toast.error("Failed to update inventory");
    }
  };

  const handleToggleAlert = async (productId: string, currentValue: boolean) => {
    try {
      await fetch(`${PRODUCT_SERVICE_URL}/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ lowStockAlert: !currentValue }),
      });
      fetchInventory();
    } catch {
      toast.error("Failed to update alert setting");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">All products are well stocked</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reserved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Low Stock Alert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-gray-500">${item.product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                          className="w-20 border rounded px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 border text-xs rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`font-medium ${item.quantity <= 5 ? "text-amber-600" : ""}`}>
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.reservedQty}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAlert(item.product.id, item.lowStockAlert)}
                      className={`text-xs px-2 py-1 rounded ${item.lowStockAlert ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {item.lowStockAlert ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditQuantity(item.quantity);
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}