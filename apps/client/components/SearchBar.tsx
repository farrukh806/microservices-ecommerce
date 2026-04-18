import { Search } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input className="h-8 w-[150px] rounded-none border border-border bg-transparent text-xs uppercase tracking-wider focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground placeholder:text-xs placeholder:uppercase lg:w-[250px]" placeholder="Search..." />
    </div>
  );
};

export default SearchBar;
