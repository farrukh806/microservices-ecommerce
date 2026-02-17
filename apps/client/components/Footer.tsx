import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 rounded-md mt-10 p-2 grid grid-cols-2 gap-5 md:grid-cols-4 sm:p-4">
      {/* first section */}
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            width={36}
            height={36}
            className="w-6 h-6 md:w-9 md:h-9"
            alt="TrendShop"
          />
          <span className="text-white text-sm md:text-md lg:text-xl tracking-wide">
            TrendShop
          </span>
        </div>
        <span className="text-gray-400 text-sm">&copy;2026 Trendshop</span>
        <p className="text-gray-400 text-sm">All rights reserved.</p>
      </div>
      {/* second section */}
      <div className="flex flex-col gap-5 items-start">
        <h4 className="text-white">Links</h4>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"/"}>Homepage</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Contact</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Terms of Service</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Privacy Policy</Link>
      </div>
      {/* third section */}
      <div className="flex flex-col gap-5 items-start">
        <h4 className="text-white">Products</h4>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>All Products</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>New Arrivals</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Best Sellers</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Sale</Link>
      </div>
      {/* forth section */}
      <div className="flex flex-col gap-5 items-start">
        <h4 className="text-white">Company</h4>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>About</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Contact</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Blog</Link>
        <Link className="text-gray-400 text-sm hover:text-gray-200" href={"#"}>Affiliate Program</Link>
      </div>
    </footer>
  );
};

export default Footer;
