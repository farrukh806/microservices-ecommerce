import { MoveRight } from "lucide-react";
import React from "react";

const CartPricing = () => {
  return (
    <div className="col-span-1 shadow-xl p-5 rounded-md">
      <h3 className="text-md font-semibold">Cart Details</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Subtotal</span>
          <span className="text-xs font-semibold">$169.70</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Discount</span>
          <span className="text-xs font-semibold text-red-500">-$0.70</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Shipping Fee</span>
          <span className="text-xs font-semibold">$11.00</span>
        </div>
        <hr className="text-gray-300" />
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-sm font-semibold">$180.00</span>
        </div>
        <button className="flex gap-2 justify-center items-center flex-nowrap bg-black hover:bg-gray-800 text-white px-2 py-1 rounded-md">
          <span>Continue</span>
          <MoveRight color="white" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartPricing;
