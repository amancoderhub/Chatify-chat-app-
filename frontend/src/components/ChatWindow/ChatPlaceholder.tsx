import { MessageCircle } from "lucide-react";

const ChatPlaceholder: React.FC = () => {
    return (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-radial-[at_top] from-sky-100 via-white to-slate-100 px-6 text-center text-slate-500">
        <div className="rounded-full bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <MessageCircle className="size-16 opacity-70" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-slate-800">Welcome to Chatty</h2>
        <p className="mt-2 max-w-sm text-sm leading-6">
            Select a friend from your list to start chatting
        </p>
        </div>
    );
};

export default ChatPlaceholder;
