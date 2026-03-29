import Conversations from "./Conversations";
import Header from "./Header";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { ConversationsProvider } from "../../contexts/ConversationsContext";

const Sidebar: React.FC = () => {
  return (
    <div className="flex h-dvh min-h-0 flex-col border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <Header />
      <ConversationsProvider>
        <SearchBar />
        <Conversations />
      </ConversationsProvider>
      <UserProfile />
    </div>
  );
};

export default Sidebar;
