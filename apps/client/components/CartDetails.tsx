"use client";
import { useCartStore } from "../providers/cart-store-provider";
import CartItem from "./CartItem";
import CartPricing from "./CartPricing";

const CartDetails = () => {
  const cartItems = useCartStore((selector) => selector.products);
  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      {/* cart details */}
      <div className="min-h-full col-span-2 shadow-xl p-5 rounded-md">
        <h3 className="text-md font-semibold">Cart Items</h3>

        <div className="mt-5 flex flex-col gap-5">
          {/* cart item */}
          {cartItems.map((item) => (
            <CartItem {...item} />
          ))}
        </div>
      </div>
      {/* price details */}
      <CartPricing />
    </div>
  );
};

export default CartDetails;
