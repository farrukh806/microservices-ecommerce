import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1 focus-within:shadow-md">
      <Search className="w-4 h-4 gray-500" />
      <input className="outline-0 text-sm" placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
