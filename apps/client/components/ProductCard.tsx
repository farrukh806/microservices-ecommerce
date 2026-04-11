"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "../providers/cart-store-provider";
import { cartApi } from "../lib/api-client";
import { IProduct } from "../types/product";
import toast from "react-hot-toast";

const ProductCard: React.FC<IProduct> = (props) => {
  const { colors, images, name, price, sizes } = props;
  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0] as string,
  );
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] as string);
  const addProduct = useCartStore((selector) => selector.addProduct);
  const addProductToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await cartApi.addItem({
        productId: props.id,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      });
      addProduct({
        name: props.name,
        description: props.description,
        id: props.id,
        price: props.price,
        quantity: 1,
        shortDescription: props.shortDescription,
        size: selectedSize,
        color: selectedColor,
        image: props.images[selectedColor] as string,
      });
      toast.success("Product added to cart");
    } catch {
      toast.error("Failed to add item to cart");
    }
  };
  const productUrl = `/products/${props.id}`;

  return (
    <div className="bg-transparent border border-black product-card rounded-none hover:border-gray-800 transition-colors group">
      <Link href={productUrl} className="block">
        {typeof selectedColor === "string" && (
          <div className="relative w-full aspect-320/430 overflow-hidden bg-gray-100 border-b border-black">
            <Image
              src={images[selectedColor as keyof typeof images] as string}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              alt={name}
            />
          </div>
        )}
        <h3 className="px-3 pt-3 font-heading font-bold text-lg uppercase tracking-wide">{name}</h3>
        <p className="text-gray-600 tracking-wide text-sm px-3 pb-3">
          {props.shortDescription}
        </p>
      </Link>
      <div className="flex gap-5 px-3 pb-3">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Size</span>
          <select
            className="border-0 outline-0 w-10 h-5"
            name="size"
            id="size"
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Color</span>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full border-2 border-white ${selectedColor === color ? "outline outline-gray-500" : ""}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between border-t border-black mt-auto">
        <Link href={productUrl} className="font-heading font-bold text-lg self-center px-4 w-1/3">
          ${price}
        </Link>
        <button
          type="button"
          onClick={addProductToCart}
          className="add-to-cart flex flex-1 justify-center gap-2 items-center bg-black text-white hover:bg-gray-900 transition-colors px-4 py-3 uppercase text-xs tracking-widest font-semibold border-l border-black"
        >
          <ShoppingCartIcon width={16} height={16} className="text-white" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
