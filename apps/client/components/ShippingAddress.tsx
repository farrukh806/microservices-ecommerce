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
import { useRouter } from "next/navigation";
import { orderApi } from "../lib/api-client";
import toast from "react-hot-toast";
import { useCartStore } from "../providers/cart-store-provider";

const ShippingAddress = () => {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const form = useForm<ShippingAddressType>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const submitHandler = async (data: ShippingAddressType) => {
    try {
      const order = await orderApi.createOrder({
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          addressLine: data.addressLine,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone,
        },
        paymentMethod: "stripe",
      });

      clearCart();
      toast.success("Order created! Proceeding to payment...");
      router.push(`/cart?step=payment&orderId=${order.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create order",
      );
    }
  };

  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      <div className="col-span-2 shadow-xl p-5 rounded-md bg-white border">
        <h3 className="text-md font-semibold mb-4">Shipping Address</h3>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addressLine"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Miami"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="FL"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="33101"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="United States"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 305 555 1234"
                      disabled={isSubmitting}
                      {...field}
                    />
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
                  <span>Continue to Payment</span>
                  <MoveRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <CartPricing showContinueButton={false} />
    </div>
  );
};

export default ShippingAddress;
