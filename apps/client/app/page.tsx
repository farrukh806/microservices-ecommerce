import Image from "next/image";
import ProductList from "../components/ProductList";
import Categories from "../components/Categories";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const activeCategory = (await searchParams).category;
  return (
    <section>
      <Image
        src={"/featured.png"}
        width={1280}
        height={480}
        className="w-full h-auto"
        alt="Featured Product"
      />
      <Categories activeCategory={activeCategory} />
      <ProductList activeCategory={activeCategory} />
    </section>
  );
}
