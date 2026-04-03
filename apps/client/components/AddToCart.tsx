"use client";

import React from "react";
import { ICartItem } from "../types/product";
import toast from "react-hot-toast";
import { useCartStore } from "../providers/cart-store-provider";

interface IAddToCartButton {
  product: ICartItem;
}

const AddToCartButton: React.FC<IAddToCartButton> = ({ product }) => {
  const addProduct = useCartStore((selector) => selector.addProduct);

  const addItemToCart = async () => {
    try {
      const res = await fetch("http://localhost:8001/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          size: product.size,
          color: product.color,
          quantity: product.quantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }

      // Also update local store for UI
      addProduct({ ...product });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="mt-10">
      <button
        onClick={addItemToCart}
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
