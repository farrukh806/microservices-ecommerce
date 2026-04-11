import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <Search className="w-4 h-4 text-black" />
      <Input className="h-8 w-[150px] lg:w-[250px] border border-black rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 placeholder:uppercase placeholder:text-xs uppercase text-xs tracking-wider" placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
