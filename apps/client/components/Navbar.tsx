import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import Cart from "./Cart";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-b-gray-500 pb-2">
      {/* Brand section */}
      <Link href={"/"} className="flex gap-2 items-center">
        <Image
          src={"/logo.png"}
          width={36}
          height={36}
          className="w-6 h-6 md:w-9 md:h-9"
          alt="TrendShop"
        />
        <span className="text-md font-medium md:text-xl lg:text-2xl tracking-wide">
          TrendShop
        </span>
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href={"/"}>
          <Home className="w-4 h-4 text-gray-500 hover:text-gray-900" />
        </Link>
        <Bell className="w-4 h-4 text-gray-500 hover:text-gray-900" />
        <Cart />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
