type RegistrationFormProps = {
  onSwitchToLogin: () => void;
};

const RegistrationForm = ({ onSwitchToLogin }: RegistrationFormProps) => {
    return (
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">
            Start chatting with your people in a few seconds.
            </p>
        </div>

        <form className="space-y-4">
            <div>
            <label
                htmlFor="register-full-name"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Full name
            </label>
            <input
                id="register-full-name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <div>
            <label
                htmlFor="register-username"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Username
            </label>
            <input
                id="register-username"
                type="text"
                placeholder="Choose a username"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <div>
            <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Email
            </label>
            <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <div>
            <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Password
            </label>
            <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
            />
            </div>

            <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
            Create account
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
