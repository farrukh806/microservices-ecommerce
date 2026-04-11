"use client";
import React from "react";
import { Heart } from "lucide-react";
import { wishlistApi } from "../lib/api-client";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
  size?: string;
  color?: string;
  initialInWishlist?: boolean;
  className?: string;
}

export default function WishlistButton({
  productId,
  size,
  color,
  initialInWishlist = false,
  className = "",
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = React.useState(initialInWishlist);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (inWishlist) {
        await wishlistApi.removeItem(productId, size, color);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.addItem({ productId, size, color });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}