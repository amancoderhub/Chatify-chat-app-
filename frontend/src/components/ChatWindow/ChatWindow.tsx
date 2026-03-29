import ChatPlaceholder from "./ChatPlaceholder";

const ChatWindow: React.FC = () => {
    return (
        <div className="flex h-dvh w-full min-w-0 flex-col justify-between border-l border-slate-200 bg-white/80 backdrop-blur">
        <ChatPlaceholder />
        </div>
    );
};

export default ChatWindow;
