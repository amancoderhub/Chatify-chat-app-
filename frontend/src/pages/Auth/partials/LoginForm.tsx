type LoginFormProps = {
    onSwitchToRegister: () => void;
    };

    const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
    return (
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
            Login to continue your conversations.
            </p>
        </div>

        <form className="space-y-5">
            <div>
            <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Email
            </label>
            <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <div>
            <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Password
            </label>
            <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
            Login
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
