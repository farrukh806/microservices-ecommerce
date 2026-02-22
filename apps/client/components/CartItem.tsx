import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ICartItem {
 id: string
 image: string
 name: string
 quantity: number
 size: string
 color: string
 price: number
}

const CartItem: React.FC<ICartItem> = (props) => {
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
          <span className="text-gray-500 text-sm">{props.size.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm">Color:</span>
          <span className="text-gray-500 text-sm">{props.color}</span>
        </div>
        <h2 className="font-semibold mt-5">${props.price}</h2>
      </div>
      <div className="ms-auto align-middle">
        <button className="btn bg-red-50 hover:bg-red-100 p-2 rounded-full w-10 h-10 flex items-center justify-center">
          <Trash className={`text-red-500`} width={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
