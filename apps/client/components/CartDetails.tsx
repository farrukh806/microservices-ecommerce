import products from "../app/static/products.json";
import { MoveRight, Trash } from "lucide-react";
import CartItem from "./CartItem";
import CartPricing from "./CartPricing";

const CartDetails = () => {
  return (
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
      <CartPricing />
    </div>
  );
};

export default CartDetails;
