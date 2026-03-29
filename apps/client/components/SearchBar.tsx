import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2 px-2 py-1">
      <Search className="w-4 h-4 text-gray-500" />
      <Input className="h-8 w-[150px] lg:w-[250px]" placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
