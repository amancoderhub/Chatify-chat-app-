import ConversationItem from "./ConversationItem";
import { useConversationsContext } from "../../hooks/useConversationsContext";

const Conversations: React.FC = () => {
    const { filteredConversations, isLoading, isError } = useConversationsContext();

    if (isLoading) {
        return <div className="flex-1 overflow-y-auto px-4 py-6 text-sm text-slate-500 sm:px-5">Loading conversations...</div>;
    }

    if (isError) {
        return <div className="flex-1 overflow-y-auto px-4 py-6 text-sm text-red-500 sm:px-5">Something went wrong</div>;
    }

    if (!filteredConversations.length) {
        return <div className="flex-1 overflow-y-auto px-4 py-6 text-sm text-slate-500 sm:px-5">No conversations yet.</div>;
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
                <ConversationItem
                    key={conversation.conversationId ?? conversation.friend.id}
                    {...conversation}
                />
            ))}
        </div>
    );
};

export default Conversations;
