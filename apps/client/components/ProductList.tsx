import React from "react";
import products from "../app/static/products.json";
import ProductCard from "./ProductCard";
const ProductList: React.FC<{ activeCategory: string }> = ({
  activeCategory,
}) => {
  const filteredProducts =
    !activeCategory || activeCategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.category && product.category.includes(activeCategory)
        );
  return (
    <section className="w-full mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 product-list">
      {filteredProducts.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </section>
  );
};

export default ProductList;
