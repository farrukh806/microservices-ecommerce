"use client";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ORDER_SERVICE_URL } from "@/lib/config";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ORDER_SERVICE_URL}/coupons`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      } else {
        // API might not exist yet, show empty state
        setCoupons([]);
      }
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`${ORDER_SERVICE_URL}/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
        toast.success("Coupon deleted");
      }
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <CouponForm
          editingCoupon={editingCoupon}
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingCoupon(null);
            fetchCoupons();
          }}
        />
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No coupons yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 font-medium">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm">{coupon.discountType}</td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : coupon.discountType === "FIXED_AMOUNT"
                      ? `$${coupon.discountValue}`
                      : "Free Shipping"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${coupon.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowForm(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

function CouponForm({
  editingCoupon,
  onClose,
  onSuccess,
}: {
  editingCoupon: Coupon | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    code: editingCoupon?.code || "",
    description: editingCoupon?.description || "",
    discountType: editingCoupon?.discountType || "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
    discountValue: editingCoupon?.discountValue?.toString() || "",
    minOrderAmount: editingCoupon?.minOrderAmount?.toString() || "",
    maxDiscountAmount: editingCoupon?.maxDiscountAmount?.toString() || "",
    usageLimit: editingCoupon?.usageLimit?.toString() || "",
    perUserLimit: editingCoupon?.perUserLimit?.toString() || "1",
    expiresAt: editingCoupon?.expiresAt ? editingCoupon.expiresAt.split("T")[0] : "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description || undefined,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
        expiresAt: new Date(formData.expiresAt).toISOString(),
      };

      const url = editingCoupon
        ? `${ORDER_SERVICE_URL}/coupons/${editingCoupon.id}`
        : `${ORDER_SERVICE_URL}/coupons`;
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingCoupon ? "Coupon updated" : "Coupon created");
        onSuccess();
      } else {
        toast.error("Failed to save coupon");
      }
    } catch {
      toast.error("Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingCoupon ? "Edit Coupon" : "Create Coupon"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full border rounded-md px-3 py-2 uppercase"
              required
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Type</label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as typeof formData.discountType })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {formData.discountType === "PERCENTAGE" ? "Discount %" : "Discount Amount ($)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Order ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Per User Limit</label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expires Date</label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Coupon"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}