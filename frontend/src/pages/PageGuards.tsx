import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStores";

export function PrivateRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { data, isLoading, isError } = useAuth();

    if (isLoading && isAuthenticated) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
            Checking session...
        </div>
        );
    }

    if (isError && !isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return isAuthenticated || data?.user ? <Outlet /> : <Navigate to="/auth" replace />;
    }

    export function GuestRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { data } = useAuth();

    return isAuthenticated || data?.user ? <Navigate to="/chat" replace /> : <Outlet />;
}
