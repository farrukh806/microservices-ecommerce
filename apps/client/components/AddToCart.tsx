"use client";

import React from "react";
import { ICartItem } from "../types/product";
import toast from "react-hot-toast";
import { useCartStore } from "../providers/cart-store-provider";
import { cartApi } from "../lib/api-client";

interface IAddToCartButton {
  product: ICartItem;
}

const AddToCartButton: React.FC<IAddToCartButton> = ({ product }) => {
  const addProduct = useCartStore((selector) => selector.addProduct);

  const addItemToCart = async () => {
    try {
      await cartApi.addItem({
        productId: product.id,
        size: product.size,
        color: product.color,
        quantity: product.quantity,
      });
      addProduct({ ...product });
      toast.success("Product added to cart");
    } catch {
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
