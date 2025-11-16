import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 
                         text-[#A3A29A] dark:text-[#707070] 
                         pointer-events-none" />
      <input
        type="text"
        placeholder="Search Here"
        onFocus={() => navigate("/explore")}
        className="w-full rounded-full 
                   border border-[#D3D2C9] dark:border-[#3A3A3A] 
                   py-2 pl-10 pr-4 text-sm
                   focus:outline-none focus:ring-1 focus:ring-[#D94F04]
                   bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                   text-[#2B2B2B] dark:text-[#EAEAEA]
                   placeholder-[#A3A29A] dark:placeholder-[#707070] 
                   transition-all duration-200"
      />
    </div>
  );
}