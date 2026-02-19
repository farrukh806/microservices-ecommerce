import React from "react";
import products from "../app/static/products.json";
import ProductCard from "./ProductCard";
const ProductList = () => {
  return (
    <section className="w-full mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </section>
  );
};

export default ProductList;
