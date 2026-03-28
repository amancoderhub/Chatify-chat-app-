import ChatWindow from "../../components/ChatWindow/ChatWindow";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SocketProvider } from "../../contexts/SocketContext";

const Chat: React.FC = () => {
  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <div className="w-full sm:w-1/3 max-w-md min-h-screen">
          <Sidebar />
        </div>
        <div className="hidden sm:flex flex-1 min-h-screen">
          <ChatWindow />
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
