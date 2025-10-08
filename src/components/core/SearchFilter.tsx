import { SearchIcon, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
export interface ISearchFilters {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  title?: string;
  className?: string;
}

const SearchFilter: React.FC<ISearchFilters> = ({
  searchString,
  setSearchString,
  title,
  className,
}) => {
  console.log(className, "className");

  return (
    <div className={`relative w-52 flex items-center group ${className}`}>
      <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent text-black text-opacity-60 rounded-none w-[20px] h-[20px] p-1 transition-transform duration-200 ease-in-out group-hover:scale-110 " />
      <Input
        placeholder={title}
        value={searchString}
        autoComplete="off"
        id="search"
        onChange={(e) => {
          const value = e.target.value.trimStart();
          setSearchString(value);
        }}
        className={`px-8 bg-gray-100 hover:bg-opacity-80 transition-all duration-300 ease-in-out border w-full h-8 placeholder:text-black placeholder:text-opacity-60 text-black  text-xs 3xl:text-sm font-normal focus-visible:ring-0 `}
      />
      {searchString && (
        <button
          onClick={() => setSearchString("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent text-black transition-all duration-200 ease-in-out hover:scale-125 hover:text-opacity-80 active:scale-90 opacity-0 group-focus-within:opacity-100"
        >
          <X className="w-4 h-4 transition-transform duration-200 ease-in-out group-hover:rotate-90" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
