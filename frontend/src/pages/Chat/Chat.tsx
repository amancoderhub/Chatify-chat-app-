import ChatWindow from "../../components/ChatWindow/ChatWindow";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SocketProvider } from "../../contexts/SocketContext";

const Chat: React.FC = () => {
  return (
    <SocketProvider>
      <div className="flex min-h-dvh bg-slate-100">
        <div className="w-full min-w-0 lg:w-[360px] lg:min-w-[320px] lg:max-w-[380px]">
          <Sidebar />
        </div>
        <div className="hidden min-w-0 flex-1 lg:flex">
          <ChatWindow />
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
