"use client";
import React, { useEffect, useState } from "react";
import products from "../../../static/products";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useCartStore } from "../../../providers/cart-store-provider";
import AddToCartButton from "../../../components/AddToCart";
import QuantitySelector from "../../../components/QuantitySelector";
import ColorSector from "../../../components/ColorSector";
import SizeSelector from "../../../components/SizeSelector";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const product = products.find((product) => product.id === id);
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] as string,
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0] as string,
  );
  const { addProduct, products: cartItems } = useCartStore(
    (selector) => selector,
  );

  if (!product) return notFound();
  const cartItem = cartItems.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  useEffect(() => {
    if (cartItem && quantity !== cartItem.quantity)
      setQuantity(cartItem.quantity);
  }, [cartItem]);
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      {/* image section */}
      <div className="relative w-full aspect-320/430 overflow-hidden bg-gray-100">
        <Image
          src={product.images[selectedColor] as string}
          alt={product.name as string}
          fill
          className="object-cover"
        />
      </div>
      {/* description section */}
      <div>
        <h2 className="text-2xl font-semibold">{product?.name}</h2>
        <p className="mt-4 text-sm text-gray-500">{product?.description}</p>
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
            ...product,
            color: selectedColor,
            size: selectedSize,
            image: product.images[selectedColor] as string,
            quantity,
          }}
        />
      </div>
    </section>
  );
};

export default ProductDetails;
