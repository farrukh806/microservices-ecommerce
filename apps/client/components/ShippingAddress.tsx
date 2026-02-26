"use client";
import React from "react";
import CartPricing from "./CartPricing";
import { useForm } from "react-hook-form";
import {
  ShippingAddress as ShippingAddressType,
  shippingAddressSchema,
} from "../app/validations/shipping-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MoveRight } from "lucide-react";

const ShippingAddress = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressType>({
    resolver: zodResolver(shippingAddressSchema),
  });
  const submitHandler = (data: ShippingAddressType) => {
    console.log(data);
  };
  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      {/* cart details */}
      <div className="col-span-2 shadow-xl p-5 rounded-md">
        <h3 className="text-md font-semibold">Shipping Address</h3>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="name" className="text-gray-600 text-sm">
                Name
              </label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className="text-gray-800 text-md outline-0 pb-2 border-b-2 border-gray-300 focus:border-gray-600"
              />
              {errors?.name && (
                <span className="text-red-500 text-xs">
                  {errors?.name?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="email" className="text-gray-600 text-sm">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="john@example.com"
                className="text-gray-800 text-md outline-0 pb-2 border-b-2 border-gray-300 focus:border-gray-600"
              />
              {errors?.email && (
                <span className="text-red-500 text-xs">
                  {errors?.email?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="phone" className="text-gray-600 text-sm">
                Phone
              </label>
              <input
                {...register("phone", { valueAsNumber: true })}
                placeholder="6578123409"
                className="text-gray-800 text-md outline-0 pb-2 border-b-2 border-gray-300 focus:border-gray-600"
              />
              {errors?.phone && (
                <span className="text-red-500 text-xs">
                  {errors?.phone?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="address" className="text-gray-600 text-sm">
                Address
              </label>
              <input
                {...register("address")}
                placeholder="23th street Harrington"
                className="text-gray-800 text-md outline-0 pb-2 border-b-2 border-gray-300 focus:border-gray-600"
              />
              {errors?.address && (
                <span className="text-red-500 text-xs">
                  {errors?.address?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="city" className="text-gray-600 text-sm">
                City
              </label>
              <input
                {...register("city")}
                placeholder="Miami"
                className="text-gray-800 text-md outline-0 pb-2 border-b-2 border-gray-300 focus:border-gray-600"
              />
              {errors?.city && (
                <span className="text-red-500 text-xs">
                  {errors?.city?.message}
                </span>
              )}
            </div>
            <button className="mt-5 px-5 py-1 flex gap-2 justify-center items-center flex-nowrap bg-black hover:bg-gray-800 text-white rounded-md">
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <MoveRight color="white" className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* price details */}
      <CartPricing showContinueButton={false} />
    </div>
  );
};

export default ShippingAddress;
