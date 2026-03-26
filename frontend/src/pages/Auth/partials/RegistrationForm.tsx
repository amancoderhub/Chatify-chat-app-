import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Lock, Mail, User, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { authService } from "../../../services/authService";
import { useAuthStore, type User as AuthUser } from "../../../stores/authStores";

type RegistrationFormProps = {
  onSwitchToLogin: () => void;
};

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: "Full name is too short" }),
    username: z
      .string()
      .trim()
      .min(2, { message: "Username is too short" })
      .max(12, { message: "Username is too long" })
      .regex(/^[a-z0-9_]+$/, {
        message:
          "Username can only contain lowercase letters, numbers, and underscores",
      })
      .transform((value) => value.toLowerCase()),
    email: z.email({ message: "Invalid email address" }).transform((value) =>
      value.toLowerCase(),
    ),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type ApiErrorResponse = {
  message?: string;
};

type RegisterResponse = {
  user: AuthUser;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-slate-900 outline-none transition focus:border-sky-500";

const RegistrationForm = ({ onSwitchToLogin }: RegistrationFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data: RegisterResponse) => {
      setUser(data.user);
      queryClient.setQueryData(["auth"], data);
      toast.success("Account created successfully.");
      reset();
      void navigate("/chat");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = ({ confirmPassword, ...data }: RegisterFormData) => {
    void confirmPassword;
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
        <p className="mt-2 text-sm text-slate-500">
          Start chatting with your people in a few seconds.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="register-full-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-full-name"
              type="text"
              placeholder="Enter your full name"
              className={inputClassName}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-username"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-username"
              type="text"
              placeholder="Choose a username"
              className={inputClassName}
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-email"
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
            htmlFor="register-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              className={inputClassName}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-confirm-password"
              type="password"
              placeholder="Confirm your password"
              className={inputClassName}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
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
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-sky-600 hover:text-sky-700"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default RegistrationForm;
