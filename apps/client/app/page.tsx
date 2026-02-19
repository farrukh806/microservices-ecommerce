import Image from "next/image";
import ProductList from "../components/ProductList";

export default function Home() {
  return (
   <section>
      <Image src={"/featured.png"} width={1280} height={480} className="w-full h-auto" alt="Featured Product" />
      <ProductList />
   </section>
  );
}
