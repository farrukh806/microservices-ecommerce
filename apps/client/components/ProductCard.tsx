"use client";
import React, { useState } from "react";
import products from "../app/static/products.json";
import Image from "next/image";
import { ShoppingCartIcon } from "lucide-react";

const ProductCard: React.FC<(typeof products)[0]> = (props) => {
  const { colors, images, name, price, shortDescription, sizes } = props;
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  return (
    <div className="bg-white shadow-md product-card rounded">
      {typeof selectedColor === "string" && (
        <div className="relative w-full aspect-320/430 overflow-hidden bg-gray-100">
          <Image
            src={images[selectedColor as keyof typeof images] as string}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            alt={name}
          />
        </div>
      )}
      <h3 className="px-2">{name}</h3>
      <p className="text-gray-500 tracking-tight text-sm px-2">
        {props.shortDescription}
      </p>
      <div className="flex gap-5 p-2">
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
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full border-2 border-white ${selectedColor === color ? "outline outline-gray-500" : ""}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <h2 className="font-semibold text-md">${price}</h2>
        <button className="add-to-cart flex flex-nowrap gap-2 items-center border border-gray-300 rounded p-1 hover:shadow-md transition-shadow">
          <ShoppingCartIcon width={20} height={20} className="text-gray-400" />
          <span className="text-sm">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
