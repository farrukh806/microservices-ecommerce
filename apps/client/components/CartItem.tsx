"use client";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useCartStore } from "../app/providers/cart-store-provider";
import toast from "react-hot-toast";
import { ICartItem } from "../app/types/product";

const CartItem: React.FC<ICartItem> = (props) => {
  const removeProduct = useCartStore((selector) => selector.removeProduct);
  const handleRemoveProduct = () => {
    removeProduct(props.id, props.size, props.color)
    toast.success("Product removed")
  }
  return (
    <div className="flex items-center gap-10" key={props.id}>
      <Image
        src={props.image}
        alt={props.name}
        width={120}
        height={80}
        className=" self-stretch"
      />
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">{props.name}</h3>
        {/* metadata */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm">Quantity:</span>
          <span className="text-gray-500 text-sm">{props.quantity}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm">Size:</span>
          <span className="text-gray-500 text-sm">
            {props.size.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm">Color:</span>
          <span className="text-gray-500 text-sm">{props.color}</span>
        </div>
        <h2 className="font-semibold mt-5">${props.price}</h2>
      </div>
      <div className="ms-auto align-middle">
        <button
          onClick={handleRemoveProduct}
          className="btn bg-red-50 hover:bg-red-100 p-2 rounded-full w-10 h-10 flex items-center justify-center"
        >
          <Trash className={`text-red-500`} width={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
