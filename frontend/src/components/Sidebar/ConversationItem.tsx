import type { ConversationItem as Conversation } from "../../services/conversationService";

function getInitials(fullName: string) {
    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return initials || "U";
}

function formatDisplayTime(timestamp?: string) {
    if (!timestamp) {
        return "";
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const now = new Date();
    const isSameDay =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isSameDay) {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
    });
}

const ConversationItem: React.FC<Conversation> = ({
    friend,
    unreadCounts,
    lastMessage,
}) => {
    const unreadCount = unreadCounts[friend.id] ?? 0;
    const initials = getInitials(friend.fullName);
    const displayTime = formatDisplayTime(lastMessage?.timestamp);

    return (
        <div className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-5">
            <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    {initials}
                </div>
                <div
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
                        friend.online ? "bg-green-400" : "bg-gray-400"
                    }`}
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                        {friend.fullName}
                    </h2>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                        {displayTime ? (
                            <span className="text-[11px] text-slate-400">{displayTime}</span>
                        ) : null}
                        {unreadCount > 0 ? (
                            <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                {unreadCount}
                            </span>
                        ) : null}
                    </div>
                </div>
                <p className="truncate text-xs text-slate-500">
                    {lastMessage?.content ?? "No messages yet"}
                </p>
            </div>
        </div>
    );
};

export default ConversationItem;
