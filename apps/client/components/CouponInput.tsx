"use client";
import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { orderApi } from "../lib/api-client";
import toast from "react-hot-toast";

interface CouponInputProps {
  subtotal: number;
  onCouponApplied?: (code: string, discountAmount: number) => void;
}

export default function CouponInput({ subtotal, onCouponApplied }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleValidate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await orderApi.validateCoupon(code.trim(), subtotal);
      if (result.valid) {
        setSuccess(`Coupon applied! You save $${result.coupon.discountAmount.toFixed(2)}`);
        onCouponApplied?.(code.trim(), result.coupon.discountAmount);
      } else {
        setError(result.reason || "Invalid coupon");
      }
    } catch {
      setError("Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border rounded text-sm uppercase"
        />
        <button
          onClick={handleValidate}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <X className="w-4 h-4" /> {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm flex items-center gap-1">
          <Check className="w-4 h-4" /> {success}
        </p>
      )}
    </div>
  );
}