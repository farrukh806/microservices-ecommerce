import { Minus, Plus } from "lucide-react";
import React from "react";

interface IQuantitySelector {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isAlreadyAdded: boolean;
}

const QuantitySelector: React.FC<IQuantitySelector> = ({
  quantity,
  setQuantity,
  isAlreadyAdded,
}) => {
  return (
    <div className="mt-10">
      <h4 className="text-xs text-gray-500">Quantity</h4>
      <div className="flex flex-wrap gap-5 items-center mt-2">
        <button
          className="px-4 py-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-200"
          onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          disabled={quantity === 1 || isAlreadyAdded}
        >
          <Minus />
        </button>
        <p className="text-md font-medium">{quantity}</p>
        <button
          className="px-4 py-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-200"
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity > 4 || isAlreadyAdded}
        >
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
