"use client";
import React from "react";

interface StockBadgeProps {
  quantity: number | null | undefined;
  lowStockThreshold?: number;
}

export default function StockBadge({ quantity, lowStockThreshold = 5 }: StockBadgeProps) {
  const qty = quantity ?? 0;

  if (qty === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Out of Stock
      </span>
    );
  }

  if (qty <= lowStockThreshold) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Low Stock ({qty} left)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      In Stock
    </span>
  );
}