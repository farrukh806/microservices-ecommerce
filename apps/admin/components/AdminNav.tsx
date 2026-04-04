"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  Layers,
  Users,
  Settings,
} from "lucide-react";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Layers,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold px-4">Admin Panel</h1>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Auth Section */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        {isSignedIn ? (
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm truncate">
                {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-4">
            <SignInButton mode="modal">
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </aside>
  );
}
