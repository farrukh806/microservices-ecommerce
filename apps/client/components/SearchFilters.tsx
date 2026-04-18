"use client";
import React from "react";
import { X } from "lucide-react";
import { type SearchFiltersProps } from "../types/components";

export default function SearchFilters({ facets, filters, onFilterChange, onClear }: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6 p-4 border-r border-gray-200 min-h-screen">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClear} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <X className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      {facets.categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
          <div className="space-y-1">
            {facets.categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.slug}
                  onChange={() => onFilterChange("category", filters.category === cat.slug ? undefined : cat.slug)}
                  className="text-blue-600"
                />
                <span className="text-sm">{cat.name}</span>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => onFilterChange("minPrice", e.target.value ? e.target.value : undefined)}
            className="w-20 px-2 py-1 border rounded text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onFilterChange("maxPrice", e.target.value ? e.target.value : undefined)}
            className="w-20 px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* Sizes */}
      {facets.sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  const current = filters.sizes?.split(",").filter(Boolean) || [];
                  const newSizes = current.includes(size.value)
                    ? current.filter((s) => s !== size.value)
                    : [...current, size.value];
                  onFilterChange("sizes", newSizes.length > 0 ? newSizes.join(",") : undefined);
                }}
                className={`px-3 py-1 border rounded-full text-sm ${filters.sizes?.split(",").includes(size.value) ? "bg-blue-100 border-blue-500" : "bg-white"}`}
              >
                {size.value.toUpperCase()} ({size.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {facets.colors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  const current = filters.colors?.split(",").filter(Boolean) || [];
                  const newColors = current.includes(color.value)
                    ? current.filter((c) => c !== color.value)
                    : [...current, color.value];
                  onFilterChange("colors", newColors.length > 0 ? newColors.join(",") : undefined);
                }}
                className={`px-3 py-1 border rounded-full text-sm ${filters.colors?.split(",").includes(color.value) ? "bg-blue-100 border-blue-500" : "bg-white"}`}
              >
                {color.value} ({color.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange("minRating", filters.minRating === r ? undefined : String(r))}
              className={`px-2 py-1 border rounded text-sm ${filters.minRating === r ? "bg-blue-100 border-blue-500" : "bg-white"}`}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === "true"}
            onChange={(e) => onFilterChange("inStock", e.target.checked ? "true" : undefined)}
            className="text-blue-600"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}