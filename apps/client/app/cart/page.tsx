import React from "react";
import CartStepper from "../../components/CartStepper";
import products from "../static/products.json";
import Image from "next/image";
import { MoveRight, Trash } from "lucide-react";
import CartItem from "../../components/CartItem";

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
  const step = Number((await searchParams).step) ?? 1;
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

      <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
        {/* cart details */}
        <div className="col-span-2 shadow-xl p-5 rounded-md">
          <h3 className="text-md font-semibold">Cart Items</h3>

          <div className="mt-5 flex flex-col gap-5">
            {/* cart item */}
            {products.slice(0, 3).map((item) => (
              <CartItem
                color={"green"}
                id={item.id.toString()}
                image={item.images.green as string}
                name={item.name}
                price={item.price}
                quantity={1}
                size="S"
              />
            ))}
          </div>
        </div>
        {/* price details */}
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
      </div>
    </section>
  );
};

export default CartPage;
