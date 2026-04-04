"use client";
import React, { useEffect } from "react";
import CartStepper from "../../components/CartStepper";
import CartDetails from "../../components/CartDetails";
import { CART_STEP_NAME, CART_STEPS } from "../constants";
import ShippingAddress from "../../components/ShippingAddress";
import PaymentStep from "../../components/PaymentStep";
import { cartApi } from "../../lib/api-client";
import { useCartStore } from "../../providers/cart-store-provider";
import { ICartItem } from "../../types/product";

const cartStepComponents = {
  [CART_STEP_NAME.SHOPPING_CART]: <CartDetails />,
  [CART_STEP_NAME.SHIPPING_ADDRESS]: <ShippingAddress />,
  [CART_STEP_NAME.PAYMENT]: <PaymentStep />,
};

const CartPage: React.FC<{
  searchParams: Promise<{ step: string; orderId?: string }>;
}> = async ({ searchParams }) => {
  const params = await searchParams;
  const step = params.step ?? "shopping-cart";
  const Component =
    cartStepComponents[step as keyof typeof cartStepComponents] ??
    cartStepComponents[CART_STEP_NAME.SHOPPING_CART];

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
      <HydrationWrapper>{Component}</HydrationWrapper>
    </section>
  );
};

const HydrationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hydrated = useCartStore((s) => s.hydrated);
  const setProducts = useCartStore((s) => s.setProducts);
  const setHydrated = useCartStore((s) => s.setHydrated);
  const setLoading = useCartStore((s) => s.setLoading);

  useEffect(() => {
    if (hydrated) return;

    const hydrate = async () => {
      setLoading(true);
      try {
        const cart = await cartApi.getCart();
        const items: ICartItem[] = (cart.items ?? []).map(
          (item: Record<string, unknown>) => ({
            id: String(item.productId),
            name: (item.product as Record<string, unknown>)?.name
              ? String((item.product as Record<string, unknown>).name)
              : "Unknown",
            shortDescription: "",
            description: "",
            price: (
              (item.product as Record<string, unknown>)?.price ?? item.price
            ) as number,
            size: String(item.size),
            color: String(item.color),
            image:
              Object.values(
                ((item.product as Record<string, unknown>)?.images as Record<
                  string,
                  string
                >) ?? {},
              )[0] ?? "/placeholder.png",
            quantity: Number(item.quantity),
          }),
        );
        setProducts(items);
      } catch (err) {
        console.error("Failed to hydrate cart:", err);
      } finally {
        setHydrated(true);
        setLoading(false);
      }
    };

    hydrate();
  }, [hydrated, setProducts, setHydrated, setLoading]);

  return <>{children}</>;
};

export default CartPage;
