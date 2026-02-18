import Image from "next/image";

export default function Home() {
  return (
   <section>
    <div className="">
      <Image src={"/featured.png"} width={1280} height={480} className="w-full h-auto" alt="Featured Product" />
    </div>
   </section>
  );
}
