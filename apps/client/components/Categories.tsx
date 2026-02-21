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

const categories = [
  {
    title: "All",
    icon: (isActive: boolean) => (
      <ShoppingBag
        width={20}
        height={20}
        className={isActive ? "text-black" : "text-gray-500"}
      />
    ),
    slug: "all",
  },
  {
    title: "T-Shirts",
    icon: (isActive: boolean) => (
      <Shirt
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "shirt",
  },
  {
    title: "Shoes",
    icon: (isActive: boolean) => (
      <Footprints
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "shoes",
  },
  {
    title: "Accesories",
    icon: (isActive: boolean) => (
      <Glasses
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "accessories",
  },
  {
    title: "Bags",
    icon: (isActive: boolean) => (
      <Handbag
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "bags",
  },
  {
    title: "Dresses",
    icon: (isActive: boolean) => (
      <PersonStanding
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "dresses",
  },
  {
    title: "Jackets",
    icon: (isActive: boolean) => (
      <Shirt
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "jackets",
  },
  {
    title: "Gloves",
    icon: (isActive: boolean) => (
      <Hand
        className={isActive ? "text-black" : "text-gray-500"}
        width={20}
        height={20}
      />
    ),
    slug: "gloves",
  },
];

const Categories: React.FC<{ activeCategory: string }> = ({
  activeCategory,
}) => {
  return (
    <section className="mt-5 bg-gray-200 flex overflow-auto justify-between p-2">
      {categories.map((category) => (
        <Link
          href={`?category=${category.slug}`}
          className={`flex shrink-0 items-center px-2 ${activeCategory === category.slug ? "bg-white rounded text-black" : "text-gray-500"}`}
          key={category.slug}
        >
          {category.icon(activeCategory === category.slug)}
          <span className="ms-1">{category.title}</span>
        </Link>
      ))}
    </section>
  );
};

export default Categories;
