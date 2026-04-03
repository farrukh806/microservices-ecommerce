"use client";

import React from "react";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 text-gray-500">
          <Users className="w-8 h-8" />
          <p>Customer management coming soon</p>
        </div>
      </div>
    </div>
  );
}
