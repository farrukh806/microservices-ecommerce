"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
import { IProduct } from "../types/product";

interface ProductListProps {
  activeCategory: string;
}

interface ApiResponse {
  items: IProduct[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const ProductList: React.FC<ProductListProps> = ({ activeCategory }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryParam = activeCategory && activeCategory !== "all" ? activeCategory : undefined;
        const params = new URLSearchParams();
        params.set("size", "20");
        if (categoryParam) params.set("category", categoryParam);

        const res = await fetch(
          `${PRODUCT_SERVICE_URL}/products?${params}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ApiResponse = await res.json();
        setProducts(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  if (loading) {
    return (
      <section className="w-full mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 product-list">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg h-80"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <section className="w-full mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 product-list">
      {products.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </section>
  );
};

export default ProductList;
