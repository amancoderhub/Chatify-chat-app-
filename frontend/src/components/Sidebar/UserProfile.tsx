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
    <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
      <div className="flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
        <UserCircle2 className="size-8" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-slate-900">
          {user?.username ?? "User"}{user?.connectCode ? ` (${user.connectCode})` : ""}
        </h2>
        <p className="truncate text-xs text-slate-500">{user?.email ?? "Online"}</p>
      </div>
      <button
        type="button"
        onClick={() => void logoutUser()}
        className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
};

export default UserProfile;
