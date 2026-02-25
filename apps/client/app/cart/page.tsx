import React from "react";
import CartStepper from "../../components/CartStepper";
import CartDetails from "../../components/CartDetails";
import { CART_STEP_NAME, CART_STEPS } from "../constants";
import ShippingAddress from "../../components/ShippingAddress";

const cartStepComponents = {
  [CART_STEP_NAME.SHOPPING_CART]: <CartDetails />,
  [CART_STEP_NAME.SHIPPING_ADDRESS]: <ShippingAddress />
};

const CartPage: React.FC<{ searchParams: Promise<{ step: string }> }> = async ({
  searchParams,
}) => {
  const step = (await searchParams).step ?? "shopping-cart";
  const Component = cartStepComponents[step as keyof typeof cartStepComponents];
  return (
    <section className="my-5">
      <h1 className="text-center text-xl font-semibold">Your Shopping Cart</h1>
      <div className="flex flex-col justify-center items-baseline sm:flex-row sm:items-center gap-5 sm:gap-10 mt-10">
        {CART_STEPS.map((item, index) => (
          <CartStepper
            isActive={step === item.step}
            step={index + 1}
            stepTitle={item.stepTitle}
            key={item.stepTitle}
          />
        ))}
      </div>
      {Component}
    </section>
  );
};

export default CartPage;
