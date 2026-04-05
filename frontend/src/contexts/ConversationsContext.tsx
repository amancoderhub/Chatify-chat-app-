import {
    createContext,
    useEffect,
    useEffectEvent,
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
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const { socket } = useSocketContext();

    useEffect(() => {
        const nextConversations = (data?.data ?? []).map((conversation) => ({
            ...conversation,
            friend: {
                ...conversation.friend,
                online: onlineStatuses[conversation.friend.id] ?? conversation.friend.online,
            },
        }));

        setConversations(nextConversations);
    }, [data]);

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
            conversations.find((conversation) => conversation.friend.id === friendId)?.friend.online;

        if (currentOnline !== online && online) {
            toast.info(`${username} is online`);
        }

        setConversations((prev) =>
            prev.map((conversation) => {
                if (conversation.friend.id !== friendId) {
                    return conversation;
                }

                return {
                    ...conversation,
                    friend: {
                        ...conversation.friend,
                        online,
                    },
                };
            }),
        );
        setOnlineStatuses((prev) => ({ ...prev, [friendId]: online }));
    });

    const handleNewConversation = useEffectEvent((conversation: ConversationItem) => {
        setConversations((prev) => {
            if (prev.some((item) => item.conversationId === conversation.conversationId)) {
                return prev;
            }

            return [conversation, ...prev];
        });

        toast.success(`You and ${conversation.friend.username} are now friends!`);
    });

    const handleErrorNewConversation = useEffectEvent((payload: { error?: string }) => {
        toast.error(payload.error ?? "Unable to add conversation");
    });

    useEffect(() => {
        socket?.on("conversation:online-status", handleConversationOnlineStatus);
        socket?.on("conversation:accept", handleNewConversation);
        socket?.on("conversation:request:error", handleErrorNewConversation);

        return () => {
            socket?.off("conversation:online-status", handleConversationOnlineStatus);
            socket?.off("conversation:accept", handleNewConversation);
            socket?.off("conversation:request:error", handleErrorNewConversation);
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
