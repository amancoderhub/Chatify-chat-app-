import {
    createContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useConversations } from "../hooks/useConversations";
import type { ConversationItem } from "../services/conversationService";

type ConversationsContextType = {
    conversations: ConversationItem[];
    filteredConversations: ConversationItem[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isLoading: boolean;
    isError: boolean;
};

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

type ConversationsProviderProps = {
    children: ReactNode;
};

export const ConversationsProvider = ({ children }: ConversationsProviderProps) => {
    const { data, isLoading, isError } = useConversations();
    const conversations = useMemo<ConversationItem[]>(() => data?.data ?? [], [data]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            return conversations;
        }

        return conversations.filter((conversation) => {
            const fullName = conversation.friend.fullName.toLowerCase();
            const username = conversation.friend.username.toLowerCase();
            const connectCode = conversation.friend.connectCode.toLowerCase();
            return (
                fullName.includes(term) ||
                username.includes(term) ||
                connectCode.includes(term)
            );
        });
    }, [conversations, searchTerm]);

    return (
        <ConversationsContext.Provider
            value={{
                conversations,
                filteredConversations,
                searchTerm,
                setSearchTerm,
                isLoading,
                isError,
            }}
        >
            {children}
        </ConversationsContext.Provider>
    );
};

export default ConversationsContext;
