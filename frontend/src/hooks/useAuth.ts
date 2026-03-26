import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "../services/authService";
import { useAuthStore, type User } from "../stores/authStores";

type MeResponse = {
    user: User;
    };

export function useAuth() {
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);

    const query = useQuery<MeResponse>({
        queryKey: ["auth"],
        queryFn: authService.me,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (query.data?.user) {
            setUser(query.data.user);
        }
    }, [query.data, setUser]);

    useEffect(() => {
        if (query.isError) {
            logout();
        }
    }, [query.isError, logout]);

    return query;
}
