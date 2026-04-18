import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 grid grid-cols-2 gap-5 rounded-md border border-border bg-card p-2 text-card-foreground md:grid-cols-4 sm:p-4">
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
          <span className="text-sm tracking-wide md:text-md lg:text-xl">
            TrendShop
          </span>
        </div>
        <span className="text-sm text-muted-foreground">&copy;2026 Trendshop</span>
        <p className="text-sm text-muted-foreground">All rights reserved.</p>
      </div>
      {/* second section */}
      <div className="flex flex-col gap-5 items-start">
        <h4>Links</h4>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"/"}>Homepage</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Contact</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Terms of Service</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Privacy Policy</Link>
      </div>
      {/* third section */}
      <div className="flex flex-col gap-5 items-start">
        <h4>Products</h4>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>All Products</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>New Arrivals</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Best Sellers</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Sale</Link>
      </div>
      {/* forth section */}
      <div className="flex flex-col gap-5 items-start">
        <h4>Company</h4>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>About</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Contact</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Blog</Link>
        <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={"#"}>Affiliate Program</Link>
      </div>
    </footer>
  );
};

export default Footer;
