export const CART_STEP_NAME = {
    SHOPPING_CART: "shopping-cart",
    SHIPPING_ADDRESS: "shipping-address",
    PAYMENT: "payment"
}

export const CART_STEPS = [
    {
      step: CART_STEP_NAME.SHOPPING_CART,
      stepTitle: "Shopping Cart",
    },
    {
      step: CART_STEP_NAME.SHIPPING_ADDRESS,
      stepTitle: "Shipping Address",
    },
    {
      step: CART_STEP_NAME.PAYMENT,
      stepTitle: "Payment",
    },
  ];