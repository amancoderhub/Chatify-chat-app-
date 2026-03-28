import { useContext } from "react";
import ConversationsContext from "../contexts/ConversationsContext";

export const useConversationsContext = () => {
    const context = useContext(ConversationsContext);
    if (!context) {
        throw new Error("useConversationsContext must be used within ConversationsProvider");
    }
    return context;
};
