import { Search } from "lucide-react";
import { useConversationsContext } from "../../hooks/useConversationsContext";

const SearchBar: React.FC = () => {
    const { searchTerm, setSearchTerm } = useConversationsContext();

    return (
        <div className="bg-sky-500 p-4">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-full bg-sky-500 px-4 py-2 pl-10 text-sm text-white placeholder-blue-200 outline-none"
                />
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-200" />
            </div>
        </div>
    );
};

export default SearchBar;
