"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useCartStore } from "../../../providers/cart-store-provider";
import AddToCartButton from "../../../components/AddToCart";
import QuantitySelector from "../../../components/QuantitySelector";
import ColorSector from "../../../components/ColorSector";
import SizeSelector from "../../../components/SizeSelector";
import { IProduct } from "../../../types/product";

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { products: cartItems } = useCartStore((selector) => selector);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
            return;
          }
          throw new Error("Failed to fetch product");
        }
        const data: IProduct = await res.json();
        setProduct(data);
        setSelectedSize(data.sizes[0] ?? "");
        setSelectedColor(data.colors[0] ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <div className="animate-pulse bg-gray-200 aspect-320/430" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-10 bg-gray-200 rounded w-1/4" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor,
  );
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

  useEffect(() => {
    if (cartItem && quantity !== cartItem.quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const imageUrl = product.images[selectedColor] || Object.values(product.images)[0];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      {/* image section */}
      <div className="relative w-full aspect-320/430 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl as string}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      {/* description section */}
      <div>
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="mt-4 text-sm text-gray-500">{product.description}</p>
        <h3 className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</h3>
        {/* sizes */}
        <SizeSelector
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          sizes={product.sizes}
        />
        {/* colors */}
        <ColorSector
          colors={product.colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
        {/* quantity */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        {/* add to cart button */}
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            price: product.price,
            size: selectedSize,
            color: selectedColor,
            image: imageUrl as string,
            quantity,
          }}
        />
      </div>
    </section>
  );
};

export default ProductDetails;
