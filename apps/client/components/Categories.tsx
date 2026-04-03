"use client";

import {
  Footprints,
  Glasses,
  Hand,
  Handbag,
  PersonStanding,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const iconMap: Record<string, (isActive: boolean) => React.ReactNode> = {
  all: (isActive) => (
    <ShoppingBag
      width={20}
      height={20}
      className={isActive ? "text-black" : "text-gray-500"}
    />
  ),
  shirt: (isActive) => (
    <Shirt
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  shoes: (isActive) => (
    <Footprints
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  accessories: (isActive) => (
    <Glasses
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  bags: (isActive) => (
    <Handbag
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  dresses: (isActive) => (
    <PersonStanding
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  jackets: (isActive) => (
    <Shirt
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
  gloves: (isActive) => (
    <Hand
      className={isActive ? "text-black" : "text-gray-500"}
      width={20}
      height={20}
    />
  ),
};

interface Category {
  slug: string;
  name: string;
}

const Categories: React.FC<{ activeCategory: string }> = ({
  activeCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([
    { slug: "all", name: "All" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/categories", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCategories([{ slug: "all", name: "All" }, ...data]);
        }
      } catch {
        // fallback to static categories
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="mt-5 bg-gray-200 flex overflow-auto justify-between p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-300 h-8 w-20 rounded" />
        ))}
      </section>
    );
  }

  return (
    <section className="mt-5 bg-gray-200 flex overflow-auto justify-between p-2">
      {categories.map((category) => {
        const iconFn = iconMap[category.slug] || iconMap.all;
        return (
          <Link
            href={`?category=${category.slug}`}
            className={`flex shrink-0 items-center px-2 ${
              activeCategory === category.slug
                ? "bg-white rounded text-black"
                : "text-gray-500"
            }`}
            key={category.slug}
          >
            {iconFn(activeCategory === category.slug)}
            <span className="ms-1">{category.name}</span>
          </Link>
        );
      })}
    </section>
  );
};

export default Categories;
