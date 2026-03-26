import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
    return (
        <div className="p-4 relative bg-sky-500">
        <input
            type="text"
            placeholder="Search conversations..."
            className="w-full text-sm bg-sky-500 text-white placeholder-blue-200 rounded-full py-2 px-4 pl-10 outline-none"
        />
        <Search className="absolute size-4.25 text-blue-200 left-7.5 top-[50%] -translate-y-[50%]" />
        </div>
    );
};

export default SearchBar;
