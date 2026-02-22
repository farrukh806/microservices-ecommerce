import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const Cart = () => {
  return (
    <Link href={"/cart?step=1"} className="relative">
        <ShoppingCart className="w-4 h-4 text-gray-500 hover:text-gray-900" />
        <span className="absolute -right-3 -top-3 flex items-center justify-center text-xs bg-amber-400 text-gray-700 font-medium rounded-full w-4 h-4">0</span>
    </Link>
  )
}

export default Cart