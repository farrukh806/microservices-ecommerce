"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 text-gray-500">
          <Settings className="w-8 h-8" />
          <p>Settings page coming soon</p>
        </div>
      </div>
    </div>
  );
}
