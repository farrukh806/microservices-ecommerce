"use client";
import React, { useState } from "react";
import products from "../app/static/products.json";
import Image from "next/image";

const ProductCard: React.FC<(typeof products)[0]> = (props) => {
  const {
    colors,
    description,
    id,
    images,
    name,
    price,
    shortDescription,
    sizes,
  } = props;
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  return (
    <div className="bg-white shadow-md flex flex-col h-full">
      {typeof selectedColor === "string"  && (
        <Image
          src={images[selectedColor as keyof typeof images] as string}
          width={320}
          height={430}
          className="w-full"
          alt={name}
        />
      )}
      <div className="p-2 flex flex-col flex-1 min-h-0">
        <h3 className="">{name}</h3>
        <p className="text-gray-500 tracking-tight text-sm my-4 flex-1">
          {props.shortDescription}
        </p>
        <div className="flex gap-5">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Size</span>
            <select
              className="border-0 focus-within:border-0 w-10 h-5"
              name="size"
              id="size"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map((size) => (
                <option value={size}>{size.toUpperCase()}</option>
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
                  className="w-5 h-5 rounded-full border border-gray-500"
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
