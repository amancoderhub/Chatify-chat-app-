import ConversationItem from "./ConversationItem";
import { useConversationsContext } from "../../hooks/useConversationsContext";

const Conversations: React.FC = () => {
    const { filteredConversations, isLoading, isError } = useConversationsContext();

    if (isLoading) {
        return <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">Loading conversations...</div>;
    }

    if (isError) {
        return <div className="flex-1 overflow-y-auto p-4 text-sm text-red-500">Something went wrong</div>;
    }

    if (!filteredConversations.length) {
        return <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">No conversations yet.</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
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
