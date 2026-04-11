"use client";
import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { wishlistApi } from "../../lib/api-client";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface WishlistItemType {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: Record<string, string>;
    inventory: { quantity: number } | null;
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlist();
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string, size?: string, color?: string) => {
    try {
      await wishlistApi.removeItem(productId, size, color);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6" /> My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const image = Object.values(item.product.images)[0] as string;
            const inStock = (item.product.inventory?.quantity ?? 0) > 0;

            return (
              <div key={item.id} className="flex gap-4 border rounded-lg p-4 bg-white">
                <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image src={image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-semibold mt-1">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4 mt-1">
                    {item.size && <span className="text-sm text-gray-500">Size: {item.size.toUpperCase()}</span>}
                    {item.color && <span className="text-sm text-gray-500">Color: {item.color}</span>}
                    <span className={`text-sm ${inStock ? "text-green-600" : "text-red-600"}`}>
                      {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId, item.size ?? undefined, item.color ?? undefined)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}