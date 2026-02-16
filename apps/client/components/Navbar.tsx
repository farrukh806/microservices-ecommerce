import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-b-gray-500">
      {/* Brand section */}
      <Link href={"/"} className="flex gap-2 items-center">
        <Image src={"/logo.png"} width={36} height={36} className="w-6 h-6 md:w-9 md:h-9" alt="TrendShop" />
        <span className="text-md font-medium md:text-xl lg:text-2xl tracking-wide">TrendShop</span>
      </Link>

      {/* Right section */}
    </nav>
  );
};

export default Navbar;
