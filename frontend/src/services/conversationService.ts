import apiClient from "../utils/apiClient";

export type ConversationItem = {
    conversationId: string | null;
    lastMessage: {
        content?: string;
        timestamp?: string;
    } | null;
    unreadCounts: Record<string, number>;
    friend: {
        id: string;
        username: string;
        fullName: string;
        connectCode: string;
        online: boolean;
    };
};

export type ConversationsResponse = {
    data: ConversationItem[];
};

export const conversationService = {
    getConversations: async () => {
        const response = await apiClient.get<ConversationsResponse>("/conversations");
        return response.data;
    },

    connectFriend: async (connectCode: string) => {
        const response = await apiClient.post("/conversations/connect", { connectCode });
        return response.data;
    },
};
