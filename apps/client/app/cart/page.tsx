import React from "react";
import CartStepper from "../../components/CartStepper";

const cartSteps = [
  {
    stepNumber: 1,
    stepTitle: "Shopping Cart",
  },
  {
    stepNumber: 2,
    stepTitle: "Shopping Address",
  },
  {
    stepNumber: 3,
    stepTitle: "Payment",
  },
];

const CartPage: React.FC<{ searchParams: Promise<{ step: string }> }> = async ({
  searchParams,
}) => {
    const step = Number((await searchParams).step) ?? 1
  return (
    <section className="my-5">
      <h1 className="text-center text-xl font-semibold">Your Shopping Cart</h1>
      <div className="flex flex-col justify-center items-baseline sm:flex-row sm:items-center gap-5 sm:gap-10 mt-10">
        {cartSteps.map((item) => (
          <CartStepper
            isActive={step === item.stepNumber}
            stepNumber={item.stepNumber}
            stepTitle={item.stepTitle}
            key={item.stepTitle}
          />
        ))}
      </div>
    </section>
  );
};

export default CartPage;
