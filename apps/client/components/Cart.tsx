"use client"
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CART_STEP_NAME } from "../app/constants";
import { useCartStore } from "../app/providers/cart-store-provider";

const Cart = () => {
  const count = useCartStore((selector) => selector.products.length)
  return (
    <Link href={`/cart?step=${CART_STEP_NAME.SHOPPING_CART}`} className="relative">
        <ShoppingCart className="w-4 h-4 text-gray-500 hover:text-gray-900" />
        <span className="absolute -right-3 -top-3 flex items-center justify-center text-xs bg-amber-400 text-gray-700 font-medium rounded-full w-4 h-4">{count}</span>
    </Link>
  )
}

export default Cart