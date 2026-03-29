import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { authService } from "../../../services/authService";
import { useAuthStore, type User } from "../../../stores/authStores";

type LoginFormProps = {
    onSwitchToRegister: () => void;
    };

    const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" })
        .transform((value) => value.toLowerCase()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    });

    type LoginFormData = z.infer<typeof loginSchema>;

    type LoginResponse = {
    user: User;
    };

    type ApiErrorResponse = {
    message?: string;
    };

    const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-slate-900 outline-none transition focus:border-sky-500";

    const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data: LoginResponse) => {
        setUser(data.user);
        toast.success("Login successful");
        void navigate("/chat");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
        const message = error.response?.data?.message ?? "Login failed";
        toast.error(message);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
            Login to continue your conversations.
            </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
            <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Email
            </label>
            <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className={inputClassName}
                {...register("email")}
                />
            </div>
            {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
            </div>

            <div>
            <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Password
            </label>
            <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className={inputClassName}
                {...register("password")}
                />
            </div>
            {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
            </div>

            <button
            type="submit"
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
            {mutation.isPending ? (
                <Loader2 className="size-5 animate-spin" />
            ) : (
                "Login"
            )}
            </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-sky-600 hover:text-sky-700"
            >
            Create one
            </button>
        </p>
        </div>
    );
};

export default LoginForm;
