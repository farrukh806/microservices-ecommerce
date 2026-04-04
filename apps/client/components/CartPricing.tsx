"use client";
import { MoveRight } from "lucide-react";
import React from "react";
import { useCartStore } from "../providers/cart-store-provider";
import { useRouter } from "next/navigation";
import { CART_STEP_NAME } from "../app/constants";

interface ICartPricing {
  showContinueButton?: boolean;
}

const CartPricing: React.FC<ICartPricing> = ({ showContinueButton = true }) => {
  const router = useRouter();
  const total = useCartStore((selector) =>
    selector.products.reduce(
      (total, currentCartItem) => total + currentCartItem.price * (currentCartItem.quantity ?? 1),
      0,
    ),
  );
  const handleRouting = () => {
    if (total > 0) router.push(`/cart?step=${CART_STEP_NAME.SHIPPING_ADDRESS}`)
  }
  return (
    <div className="col-span-1 shadow-xl p-5 rounded-md">
      <h3 className="text-md font-semibold">Cart Details</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Subtotal</span>
          <span className="text-xs font-semibold">${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Discount</span>
          <span className="text-xs font-semibold text-red-500">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Shipping Fee</span>
          <span className="text-xs font-semibold">
            {total >= 100 ? "FREE" : "$9.99"}
          </span>
        </div>
        <hr className="text-gray-300" />
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-sm font-semibold">${total.toFixed(2)}</span>
        </div>
        {showContinueButton && (
          <button disabled={total === 0} onClick={handleRouting} className="flex gap-2 justify-center items-center flex-nowrap bg-black hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-black text-white px-2 py-1 rounded-md">
            <span>Continue</span>
            <MoveRight color="white" className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPricing;
