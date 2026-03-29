import { Search } from "lucide-react";
import { useConversationsContext } from "../../hooks/useConversationsContext";

const SearchBar: React.FC = () => {
    const { searchTerm, setSearchTerm } = useConversationsContext();

    return (
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
                />
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
};

export default SearchBar;
