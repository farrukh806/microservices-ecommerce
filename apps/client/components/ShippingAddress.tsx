import React from "react";
import CartPricing from "./CartPricing";

const ShippingAddress = () => {
  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      {/* cart details */}
      <div className="col-span-2 shadow-xl p-5 rounded-md">
        <h3 className="text-md font-semibold">Shipping Address</h3>

      </div>
      {/* price details */}
      <CartPricing />
    </div>
  );
};

export default ShippingAddress;
