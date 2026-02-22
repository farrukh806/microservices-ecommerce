import React from "react";

interface ICartStepper {
  stepNumber: number;
  stepTitle: string;
  isActive: boolean;
}

const CartStepper: React.FC<ICartStepper> = ({
  isActive,
  stepNumber,
  stepTitle,
}) => {
  return (
    <div
      className={`flex items-center gap-3 sm:border-b-2  pb-4 ${isActive ? "border-gray-800" : "border-gray-300"}`}
    >
      <span className={`text-md w-6 h-6 flex items-cente justify-center text-center rounded-full ${isActive ? "bg-gray-800 text-white" : "bg-gray-500 text-white"}`}>
        {stepNumber}
      </span>
      <span
        className={`text-md font-semibold ${isActive ? "text-gray-800" : "text-gray-400"}`}
      >
        {stepTitle}
      </span>
    </div>
  );
};

export default CartStepper;
