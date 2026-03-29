"use client";
import React from "react";
import CartPricing from "./CartPricing";
import { useForm } from "react-hook-form";
import {
  ShippingAddress as ShippingAddressType,
  shippingAddressSchema,
} from "../validations/shipping-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MoveRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ShippingAddress = () => {
  const form = useForm<ShippingAddressType>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: 0,
      address: "",
      city: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const submitHandler = (data: ShippingAddressType) => {
    console.log(data);
  };

  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      {/* cart details */}
      <div className="col-span-2 shadow-xl p-5 rounded-md bg-white border">
        <h3 className="text-md font-semibold mb-4">Shipping Address</h3>
        <Form {...form}>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="6578123409" 
                      type="number" 
                      disabled={isSubmitting} 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="23th street Harrington" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Miami" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <MoveRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      {/* price details */}
      <CartPricing showContinueButton={false} />
    </div>
  );
};

export default ShippingAddress;
