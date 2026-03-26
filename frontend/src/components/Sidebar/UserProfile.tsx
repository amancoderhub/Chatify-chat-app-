import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/authStores";
import { UserCircle2 } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutUser = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      queryClient.removeQueries({ queryKey: ["auth"] });
      void navigate("/auth");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 flex items-center space-x-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
        <UserCircle2 className="size-8" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold truncate text-sm">
          {user?.username ?? "User"}{user?.connectCode ? ` (${user.connectCode})` : ""}
        </h2>
        <p className="text-xs text-gray-500">Online</p>
      </div>
      <button
        type="button"
        onClick={() => void logoutUser()}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
};

export default UserProfile;
