"use client";
import { useCartStore } from "../providers/cart-store-provider";
import CartItem from "./CartItem";
import CartPricing from "./CartPricing";

const CartDetails = () => {
  const cartItems = useCartStore((selector) => selector.products);
  const isLoading = useCartStore((selector) => selector.isLoading);

  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      <div className="min-h-full col-span-2 shadow-xl p-5 rounded-md">
        <h3 className="text-md font-semibold">Cart Items</h3>

        <div className="mt-5 flex flex-col gap-5">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-10">
                  <div className="bg-gray-200 w-30 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <CartItem
                {...item}
                key={`${item.id}-${item.size}-${item.color}`}
              />
            ))
          )}
        </div>
      </div>
      <CartPricing />
    </div>
  );
};

export default CartDetails;
