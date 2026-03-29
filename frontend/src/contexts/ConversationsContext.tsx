import {
    createContext,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import { useConversations } from "../hooks/useConversations";
import type { ConversationItem } from "../services/conversationService";
import { useSocketContext } from "./SocketContext";

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
    const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const { socket } = useSocketContext();

    const conversations = useMemo(
        () =>
            (data?.data ?? []).map((conversation) => ({
                ...conversation,
                friend: {
                    ...conversation.friend,
                    online: onlineStatuses[conversation.friend.id] ?? conversation.friend.online,
                },
            })),
        [data, onlineStatuses],
    );

    const filteredConversations = conversations.filter((conversation) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            return true;
        }

        const fullName = conversation.friend.fullName.toLowerCase();
        const username = conversation.friend.username.toLowerCase();
        const connectCode = conversation.friend.connectCode.toLowerCase();

        return (
            fullName.includes(term) ||
            username.includes(term) ||
            connectCode.includes(term)
        );
    });

    const handleConversationOnlineStatus = useEffectEvent(({
        friendId,
        username,
        online,
    }: {
        friendId: string;
        username: string;
        online: boolean;
    }) => {
        const currentOnline =
            onlineStatuses[friendId] ??
            data?.data.find((conversation) => conversation.friend.id === friendId)?.friend.online;

        if (currentOnline !== online && online) {
            toast.info(`${username} is online`);
        }

        setOnlineStatuses((prev) => ({ ...prev, [friendId]: online }));
    });

    useEffect(() => {
        socket?.on("conversation:online-status", handleConversationOnlineStatus);

        return () => {
            socket?.off("conversation:online-status", handleConversationOnlineStatus);
        };
    }, [socket]);

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
