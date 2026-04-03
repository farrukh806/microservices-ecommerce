"use client";

import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

const stats = [
  { title: "Total Products", value: "124", icon: Package, change: "+12%" },
  { title: "Total Orders", value: "89", icon: ShoppingCart, change: "+5%" },
  { title: "Revenue", value: "$12,450", icon: DollarSign, change: "+18%" },
  { title: "Customers", value: "456", icon: Users, change: "+8%" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-green-500 text-sm mt-2">{stat.change} this month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
