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
    <section className="mt-8">
      <div className="flex flex-col lg:flex-row items-center border-b border-border pb-12 mb-12">
        <div className="w-full lg:w-1/2 pe-0 lg:pe-8 mb-8 lg:mb-0">
          <h1 className="text-6xl md:text-8xl font-bold font-heading leading-[0.85]">
            MOMENTS OF BEAUTY
          </h1>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            Discover our meticulously curated collection designed to elevate your everyday aesthetics.
          </p>
          <button className="mt-10 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase transition-colors hover:opacity-90">
            Explore Collection
          </button>
        </div>
        <div className="w-full lg:w-1/2 border border-border p-2">
          <div className="relative aspect-video w-full bg-accent">
            <Image
              src={"/featured.png"}
              fill
              className="object-cover"
              alt="Featured Product"
            />
          </div>
        </div>
      </div>
      <Categories activeCategory={activeCategory} />
      <ProductList activeCategory={activeCategory} />
    </section>
  );
}
